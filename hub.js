'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const MessageQueue = require('./lib/MessageQueue');
const {eventEmitter, eventPool} = require('./eventPool');

const io = new Server(PORT);
const capsServer = io.of('/caps');
let capsInbox = new MessageQueue();
let vendorDelivered = new MessageQueue();
let driverPickup = new MessageQueue();

const logEvent = (eventName) => (payload) => {
  console.log(`
    EVENT: {
      event: ${eventName},
      time: ${new Date()},
      payload:`, payload
  )
}

capsServer.on('connection', (socket) => {
  console.log(`CLIENT CONNECTED TO CAPS SERVER \n SOCKET: `, socket.id);

  socket.on('join', (payload) => {
    socket.join(payload.store)
  })

  // handles PICKUP events
  socket.on(eventPool[0], (payload) => {
    // check to see if driverPickup queue already has a subqueue for a given vendor
    let pendingVendorPackages = driverPickup.read(payload.store)
    if (pendingVendorPackages) {
      // if there is already a subqueue for a vendor's packages, save the new package information to the pending packages queue
      pendingVendorPackages.save(payload.orderId, payload)
    }
    // otherwise, create the subqueue. store the pending package inside the subqueue.
    else {
      pendingVendorPackages = new MessageQueue();
      pendingVendorPackages.save(payload.orderId, payload);
      driverPickup.save(payload.store, pendingVendorPackages);
    }
    // logs event to server console when vendor has package ready for pickup
    logEvent(eventPool[0])(payload);
    console.log('Package ready for pickup; Notifying driver.\n')
    // sends a 'PICKUP' alert to the drivers, letting them know that a package is ready for pickup
    socket.broadcast.emit(eventPool[0], payload)
  })



  // handles 'IN-TRANSIT' events
  socket.on(eventPool[1], (payload) => {
    // gets all messages from a specific vendor from the main inbox
    let messages = driverPickup.read(payload.store);
    // sends all the vendor messages to the driver
    console.log('Driver is en route to delivery address \n')
    socket.broadcast.emit(eventPool[1], messages)
    // logs event to server console when driver is en route to delivery address
    logEvent(eventPool[1])(payload)
  })

  // handles 'DELIVERED' events
  socket.on(eventPool[2], (payload) => {
    try {
      console.log('Driver successfully delivered package to customer \n')
      // logs event to server console, (i.e. lets HQ know that package was delivered)
      logEvent(eventPool[2])(payload)
      console.log('Notifying vendor that package was delivered: \n', deliveredOrder );

    } catch (err) {
      // notifies the vendor that there was an error in delivering the package
      socket.to(payload.store).emit(`${eventPool[2]}-error`, {error: err, message: 'Error delivering package'})
    }
  })

  socket.on(eventPool[3], (payload) => {
    try {
      // attempts to read orders from vendor
      let vendorInbox = vendorDelivered.read(payload.store);
      // removes orders if they exist (i.e. 'delivers packages')
      let deliveredOrder = vendorInbox.remove(payload.orderId);
      // notifies the vendor that package has been successfully delivered
      socket.to(payload.store).emit(eventPool[3], deliveredOrder)
    } catch(err) {

    }
  })

})

// eventEmitter.on(eventPool[0], logEvent(eventPool[0]))
// eventEmitter.on(eventPool[1], logEvent(eventPool[1]))
// eventEmitter.on(eventPool[2], logEvent(eventPool[2]))


// require('./driver/index')
// require('./vendor/index')
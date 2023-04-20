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

  // server receives pickup event from vendor
  socket.on(eventPool[0], (payload) => {

    // check to see if driverPickup queue already has a subqueue for a given vendor
    let pendingVendorPackages = driverPickup.read(payload.store)

    if (pendingVendorPackages) {
      // if there is already a subqueue for a vendor's packages, save the new package information to the pending packages queue
      pendingVendorPackages.save(payload.orderId, {
        event: eventPool[0],
        messageId: payload.orderId,
        clientId: payload.store,
        order: payload
      })
    }

    // otherwise, create the subqueue and save the pending package inside the subqueue.
    else {
      pendingVendorPackages = new MessageQueue();
      pendingVendorPackages.save(payload.orderId, {
        event: eventPool[0],
        messageId: payload.orderId,
        clientId: payload.store,
        order: payload
      });
      driverPickup.save(payload.store, pendingVendorPackages);
    }

    // sends a 'PICKUP' alert to the drivers, letting them know that a package is ready for pickup
    socket.broadcast.emit(eventPool[0], payload)

    // logs event to server console when vendor has package ready for pickup
    logEvent(eventPool[0])(payload);
  })



  // receives transit event from driver
  socket.on(eventPool[1], (payload) => {
    console.log('HUB RECEIVED TRANSIT EMIT FROM DRIVER')
    // gets all pendingDeliveries from a specific vendor from the main inbox
    let pendingDeliveries = driverPickup.read(payload.store);

    // sends all the pendingDeliveries to the driver
    socket.emit(eventPool[1], pendingDeliveries)

    // logs event to server console when driver is en route to delivery address
    logEvent(eventPool[1])(payload)

  })

  // receives delivered event from driver
  socket.on(eventPool[2], (payload) => {

    console.log('PENDING DRIVER DELIVERIES: ', driverPickup)
    console.log('PAYLOAD INFORMATION: ', payload)

    let pendingVendorPackages = driverPickup.read(payload.clientId)
    pendingVendorPackages.remove(payload.messageId)

    let vendorInbox = vendorDelivered.read(payload.clientId);

    if (vendorInbox) {
      vendorInbox.save(payload.messageId, {
        event: eventPool[2],
        messageId: payload.messageId,
        clientId: payload.clientId,
        order: payload.order
      })
    }
    else {
      vendorInbox = new MessageQueue();
      vendorInbox.save(payload.messageId, {
        event: eventPool[2],
        messageId: payload.messageId,
        clientId: payload.clientId,
        order: payload.order
      });
      vendorDelivered.save(payload.clientId, vendorInbox)
    }

    socket.to(payload.clientId).emit(eventPool[2], payload)
  })

  socket.on(eventPool[3], (payload) => {
    try {
      // checks if there is a 'deliver successful' queue of messages for a vendor
      let vendorInbox = vendorDelivered.read(payload.clientId);

      console.log(vendorInbox)
      // removes orders if they exist (i.e. 'delivers packages')
      let deliveredOrder = vendorInbox.remove(payload.messageId);

      console.log('Vendor acknowledges package delivery \n')

      // logs event to server console, (i.e. lets HQ know that package was delivered)
      logEvent(eventPool[3])(deliveredOrder)

    } catch (err) {
      console.log('ERROR REMOVING MESSAGE FROM VENDOR RECEIVED QUEUE')
      // notifies the vendor that there was an error in delivering the package
      socket.to(payload.store).emit(`${eventPool[3]}-error`, {error: err, message: 'Vendor cannot acknowledge package delivery'})
    }
  })

  socket.on(eventPool[4], (payload) => {

  })

})

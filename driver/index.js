'use strict';

const { eventEmitter, eventPool } = require('../eventPool');
const { packageDeliveredToCustomer, pickupPackage, capsSocket } = require('./handler');

// receives pickup event from the server
capsSocket.on(eventPool[0], (payload) => {

  // emits transit event to the server
  pickupPackage(payload);
})

// receives transit event from the server, receives all pending delivery messages
capsSocket.on(eventPool[1], (payload) => {
  console.log('DRIVER RECEIVED TRANSIT EMIT FROM HUB')

  // emits a delivery event for each pendingDelivery received (i.e. 'delivers' each package)
  packageDeliveredToCustomer(payload)
})

capsSocket.on('join', (payload) => {
  console.log('DRIVER JOINED ROOM')
})
'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const { eventEmitter, eventPool } = require('../eventPool');
const { packageDeliveredToCustomer, packagePickedUpFromVendor } = require('./handler');

const capsSocket = io(SERVER_URL + '/caps')

capsSocket.on(eventPool[0], (payload) => {
  console.log('Driver has been notified, en route to pick up package from Vendor.')
  // capsSocket.emit('join', payload);
  packagePickedUpFromVendor(payload);
  capsSocket.emit(eventPool[1], payload);
  packageDeliveredToCustomer(payload);
  capsSocket.emit(eventPool[2], payload);
})

// eventEmitter.on(eventPool[0], (payload) => {
//   packagePickedUpFromVendor(payload);
//   packageDeliveredToCustomer(payload);
// });


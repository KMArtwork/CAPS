'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const {eventEmitter, eventPool} = require('../eventPool');
const { packageReadyForPickup, packageDeliveredAlert, capsSocket } = require('./handler');



// handles 'delivered' events
capsSocket.on(eventPool[2], packageDeliveredAlert)

// handles 'delivered-error' events
capsSocket.on(`${eventPool[2]}-error`, (payload) => {
  console.log(payload)
})

const placeOrder = () => {
  let payload = packageReadyForPickup();
  capsSocket.emit('join', payload)
  console.log('Vendor package ready for pickup')
  capsSocket.emit(eventPool[0], payload);
}

setInterval(placeOrder, 12000);

'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const {eventEmitter, eventPool} = require('../eventPool');

const capsSocket = io(SERVER_URL + '/caps')

const pickupPackage = (payload) => {
  console.log(`DRIVER: Package #${payload.orderId} picked up from ${payload.store} \n`)

  capsSocket.emit(eventPool[1], payload);
}

const packageDeliveredToCustomer = (payload) => {
  Object.values(payload.messages).forEach(message => {
    console.log(`DRIVER: Successfully delivered package #${message.messageId} \n`);
    capsSocket.emit(eventPool[2], message);
  })
}

module.exports = {
  packageDeliveredToCustomer,
  pickupPackage,
  capsSocket
}


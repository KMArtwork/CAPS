'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const {eventEmitter, eventPool} = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const storeName = chance.company();

const capsSocket = io(SERVER_URL + '/caps')

const generatePackage = () => {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address()
  };
}

const placeOrder = () => {
  let payload = generatePackage();

  capsSocket.emit('join', payload)

  console.log('Vendor package ready for pickup')

  capsSocket.emit(eventPool[0], payload);
}

const packageDeliveredAlert = (payload) => {
  console.log(`Thank you ${payload.order.customer} for shopping with ${payload.clientId}`)
  capsSocket.emit(eventPool[3], payload)
}



module.exports = {
  generatePackage,
  placeOrder,
  packageDeliveredAlert,
  capsSocket
}
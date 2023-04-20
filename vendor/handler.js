'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const storeName = chance.company();

const capsSocket = io(SERVER_URL + '/caps')

const packageReadyForPickup = () => {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address()
  };
}

const packageDeliveredAlert = (payload) => {
  console.log(`Thank you ${payload.customer} for shopping with ${payload.store}`)
  capsSocket.emit(eventPool[3], payload)
}



module.exports = {
  packageReadyForPickup,
  packageDeliveredAlert,
  capsSocket
}
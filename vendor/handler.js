'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const order = {
  store: chance.company(),
  orderId: chance.guid(),
  customer: chance.name(),
  address: chance.address()
}

const packageReadyForPickup = () => {
  return order;
}

const packageDeliveredAlert = (payload) => {
  console.log(`Thank you for your order ${payload.customer}`)
}

// packageReadyForPickup(chance.company());

module.exports = {
  packageReadyForPickup,
  packageDeliveredAlert
}
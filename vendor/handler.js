'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const packageReadyForPickup = () => {
  console.log('Vendor package ready for pickup')
  return {
    store: chance.company(),
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address()
  }
}

const packageDeliveredAlert = (payload) => {
  console.log(`Thank you for your order ${payload.customer}\n`, payload)
}

// packageReadyForPickup(chance.company());

module.exports = {
  packageReadyForPickup,
  packageDeliveredAlert
}
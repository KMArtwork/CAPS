'use strict';

const {eventEmitter, eventPool} = require('../eventPool');

const packageDeliveredToCustomer = (payload) => {
  console.log(`DRIVER: Successfully delivered package #${payload.orderId}`);

  eventEmitter.emit(eventPool[2], payload)
}

const packagePickedUpFromVendor = (payload) => {
  console.log(`DRIVER: Package #${payload.orderId} picked up from ${payload.store}`)

  eventEmitter.emit(eventPool[1], payload)
}

module.exports = {
  packageDeliveredToCustomer,
  packagePickedUpFromVendor
}

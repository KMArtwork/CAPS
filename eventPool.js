'use strict';

const Events = require('events');
const eventEmitter = new Events();

const eventPool = [
  'vendorPickup',
  'driverPickup',
  'inTransit',
  'driverDelivery',
  'vendorDelivery'
]

module.exports = {
  eventPool,
  eventEmitter
}
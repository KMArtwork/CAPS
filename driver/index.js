'use strict';

const { eventEmitter, eventPool } = require('../eventPool');
const { packageDeliveredToCustomer, packagePickedUpFromVendor } = require('./handler');

eventEmitter.on(eventPool[0], (payload) => {
  packagePickedUpFromVendor(payload);
  packageDeliveredToCustomer(payload);
});


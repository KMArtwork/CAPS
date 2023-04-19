'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const { packageReadyForPickup, packageDeliveredAlert } = require('./handler');

eventEmitter.on(eventPool[2], packageDeliveredAlert);

eventEmitter.emit(eventPool[0], packageReadyForPickup())
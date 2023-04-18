'use strict';

const {eventEmitter, eventPool} = require('../eventPool');

// listens for driverPickup event, sends out emits 'inTransit' event
eventEmitter.on(eventPool[1], (payload) => {
  eventEmitter.emit(eventPool[2], 'Driver has package. Package en route to destination')
})

const packageDelivered = (payload) => {
  eventEmitter.emit(eventPool[3], 'Package successfully delivered')
}


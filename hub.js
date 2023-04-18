'use strict';

const {eventEmitter, eventPool} = require('./eventPool');

const state = {
  pickup: [],
  received: [],
  transit: [],
  delivered: [],
}

const notifyDriver = (payload) => {
  eventEmitter.emit(eventPool[1], payload)
}

const packageEnRoute = (payload) => {
  eventEmitter.emit(eventPool[2], payload)
}

const packageDelivered = (payload) => {
  eventEmitter.emit(eventPool[3], payload)
}

const notifyVendor = (payload) => {
  eventEmitter.emit(eventPool[4], payload)
}

// listens for 'vendorPickup' events | alerts system that vendor has a package to be picked up
eventEmitter.on(eventPool[0], (payload) => {
  console.log('Vendor has a package that needs to be picked up')
  
  let stateUpdate = {
    event: 'pickup',
    time: new Date(Date.now()).toISOString,
    payload: payload
  }

  state.pickup.push(stateUpdate)

  notifyDriver(stateUpdate)
})

// listens for 'driverPickup' events | notifies driver there is a package to be delieverd
eventEmitter.on(eventPool[1], (payload) => {
  console.log('Driver being notified on vendor package')

  let stateUpdate = {
    event: 'received',
    time: new Date(Date.now()).toISOString,
    payload: payload.payload,
  }

  state.received.push(stateUpdate)

  packageEnRoute(stateUpdate)
})

// listens for 'driverPickup' events
eventEmitter.on(eventPool[2], (payload) => {
  console.log('Driver has package and is en route to destination')

  let stateUpdate = {
    event: 'transit',
    time: new Date(Date.now()).toISOString,
    payload: payload.payload,
  }

  state.transit.push(stateUpdate)

  packageDelivered(stateUpdate)
})

eventEmitter.on(eventPool[3], (payload) => {
  console.log('Package successfully delivered');

  let stateUpdate = {
    event: 'delivered',
    time: new Date(Date.now()).toISOString,
    payload: payload.payload,
  }

  state.delivered.push(stateUpdate)

  notifyVendor(stateUpdate)
})



require('./vendor/handler')
require('./driver/handler')
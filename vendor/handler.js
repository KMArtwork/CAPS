'use strict';

const {eventEmitter, eventPool} = require('../eventPool');

// send alert to server via 'pickup' event

const testPayload = {
  store: "Belethor's General Goods",
  orderId: Math.random() * 100,
  customer: "The Dragonborn",
  address: "Honeyside, Riften"
}

const packageReadyForPickup = (payload) => {
  eventEmitter.emit(eventPool[0], payload)
}

eventEmitter.on(eventPool[4], (payload) => {
  console.log('Vendor knows package has been delivered')
  console.log(payload)
})

packageReadyForPickup(testPayload);
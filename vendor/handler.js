'use strict';

const {eventEmitter, eventPool} = require('../eventPool');

// send alert to server via 'pickup' event

const testPayload = {
  store: "Belethor's General Goods",
  orderId: Math.random() * 100,
  customer: "The Dragonborn",
  address: "Honeyside, Riften"
}

const packageReadyForPickup = (storeName) => {
  eventEmitter.emit(eventPool[0], {
    store: storeName,
    orderId: Math.random() * 100,
    customer: "The Dragonborn",
    address: "Honeyside, Riften"
  })
}

eventEmitter.on(eventPool[4], (payload) => {
  console.log(`Thank you for your order ${payload.payload.customer}\n`, payload)
})

packageReadyForPickup("Belethor's General Goods");
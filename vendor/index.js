'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const { 
  generatePackage,
  placeOrder, 
  packageDeliveredAlert, 
  capsSocket 
} = require('./handler');



// handles 'delivered' events
capsSocket.on(eventPool[2], packageDeliveredAlert)

// handles 'delivered-error' events
capsSocket.on(`${eventPool[2]}-error`, (payload) => {
  console.log(payload)
})

capsSocket.on(`join`, (payload) => {
  console.log(`VENDOR JOINED ROOM`)
})


setInterval(placeOrder, 5000);

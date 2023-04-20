'use strict';

const {eventEmitter, eventPool} = require('../eventPool');
const { generatePackage, packageDeliveredAlert, capsSocket } = require('./handler');



// handles 'delivered' events
capsSocket.on(eventPool[2], packageDeliveredAlert)

// handles 'delivered-error' events
capsSocket.on(`${eventPool[2]}-error`, (payload) => {
  console.log(payload)
})

const placeOrder = () => {
  let payload = generatePackage();

  capsSocket.emit('join', payload)

  console.log('Vendor package ready for pickup')

  capsSocket.emit(eventPool[0], payload);
}

setInterval(placeOrder, 5000);

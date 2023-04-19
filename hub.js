'use strict';

const {eventEmitter, eventPool} = require('./eventPool');

const logEvent = (eventName) => (payload) => {
  console.log(`
    EVENT: {
      event: ${eventName},
      time: ${new Date()},
      payload:`, payload
  )
}

// eventEmitter.on(eventPool[0], logEvent(eventPool[0]))
// eventEmitter.on(eventPool[1], logEvent(eventPool[1]))
// eventEmitter.on(eventPool[2], logEvent(eventPool[2]))


// require('./driver/index')
// require('./vendor/index')

module.exports = {
  logEvent
}
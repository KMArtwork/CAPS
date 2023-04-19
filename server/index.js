'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const { logEvent } = require('../hub');
const { eventPool } = require('../eventPool');

const io = new Server(PORT);
const capsServer = io.of('/caps');

capsServer.on('connection', (socket) => {
  console.log(`CLIENT CONNECTED TO CAPS SERVER \n SOCKET: `, socket.id);

  socket.on(eventPool[0], logEvent(eventPool[0]))
  socket.on(eventPool[0], (payload) => {
    console.log('Package ready for pickup; Notifying driver.')
    capsServer.emit(eventPool[0], payload)
  })
  socket.on(eventPool[1], logEvent(eventPool[1]))
  socket.on(eventPool[2], logEvent(eventPool[2]))
  socket.on(eventPool[2], (payload) => {
    console.log('Notifying vendor that package was delivered.');
    capsServer.emit(eventPool[2], payload)
  })

})


// require('../driver/index')
// require('../vendor/index')
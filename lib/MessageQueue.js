'use strict';

class MessageQueue {
  constructor() {
    this.messages = {
      // store1: {
      //   order1: {this is what a main inbox might look like},
      //   order2: {},
      // },
      // store2: {},
      // store3: {},
    };
  }

  save(key, value) {
    this.messages[key] = value;
    return key;
  }

  read(key) {
    return this.messages[key];
  }

  remove(key) {
    let value = this.messages[key];
    delete this.messages[key];
    return value;
  }
}

module.exports = MessageQueue;
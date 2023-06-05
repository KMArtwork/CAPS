'use strict';

class MessageQueue {
  constructor() {
    this.messages = {};
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
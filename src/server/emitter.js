const EventEmitter2 = require('eventemitter2').EventEmitter2;
const server = new EventEmitter2({
  wildcard: true,
  delimiter: '::',
  newListener: true,
  maxListeners: 20,
  verboseMemoryLeak: true
});

module.exports = server;

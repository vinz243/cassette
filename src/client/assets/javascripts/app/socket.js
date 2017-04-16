import socketIO from 'socket.io-client';

const io = socketIO(window.location.origin);

const listen = function (event, listener) {
  if (io.id) {
    process.nextTick(() => {
      io.on(event, ({args}) => listener(...args));
      io.emit('emitter.on', {event});
    });
    return;
  }
  io.on('connect', function () {
    process.nextTick(() => {
      io.on(event, ({args}) => listener(...args));
      io.emit('emitter.on', {event});
    });
  });
}

const emit = function (event, ...args) {
  if (io.id) {
    process.nextTick(() => {
      io.emit('emitter.emit', {args, event});
    });
    return;
  }
  io.on('connect', function () {
    process.nextTick(() => {
      io.emit('emitter.emit', {args, event});
    });
  });
}

const on = (...args) => io.on(...args);

export default {listen, emit, on};

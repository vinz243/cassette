import socketIO from 'socket.io-client';

const io = socketIO(window.location.origin);

const listen = function (event, listener) {
  io.on(event, listener);
  io.emit('emitter.on', {event});
}

const emit = function (event, ...args) {
  io.emit('emitter.emit', {args, event});
}

export default {listen, emit};

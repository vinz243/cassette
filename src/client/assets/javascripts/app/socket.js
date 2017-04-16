import socketIO from 'socket.io-client';

const io = socketIO(window.location.origin);

export const listen = function (event, listener) {
  io.on(event, listener);
  io.emit('emitter.on', {event});
}

export const emit = function (event, ...args) {
  io.emit(event, {args});
}

window.emit = emit;

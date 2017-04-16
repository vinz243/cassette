const socketIO = require('socket.io');
const emitter = require('emitter');

module.exports = function(app) {
  const io = socketIO(app);

  io.on('connection', function (socket) {
    emitter.emit(['socket', 'connect'], {
      id: socket.id
    });
    const listeners = [];
    socket.on('emitter.emit', ({args}) => {
      emitter.emit(['socket', 'emit'], data);
      emitter.emit(data.event, ...args);
    })
    socket.on('emitter.on', (data) => {
      emitter.emit(['socket', 'addlistener'], data);
      const listener = function (...args) {
        socket.emit(data.event, {args});
      }
      emitter.on(data.event, listener);
      listeners.push([data.event, listener]);
    });
    socket.on('disconnect', function (data) {
      emitter.emit(['socket', 'connect'], {
        id: socket.id,
        reason: data.reason
      });

      listeners.forEach(([event, listener]) => {
        emitter.off(event, listener);
      })
    })
  })
}

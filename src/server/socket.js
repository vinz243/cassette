const socketIO = require('socket.io');
const emitter = require('emitter');
const {mainStory} = require('storyboard');

module.exports = function(app) {
  const io = socketIO(app);
  mainStory.info('socket', 'Injecting socket.io into app...');
  io.on('connection', function (socket) {
    mainStory.debug('socket', `Socket #${socket.id} connected`);

    emitter.emit(['socket', 'connect'], {
      id: socket.id
    });
    const listeners = [];
    socket.on('emitter.emit', ({args, event}) => {
      if (event === 'checks::socketiotest::pong') {
        emitter.emit(['socket', 'emit'], {args});
        emitter.emit(event, ...args);
      }
    })
    socket.on('emitter.on', (data) => {
      if (data.event === 'checks::socketiotest::ping') {
        emitter.emit(['socket', 'addlistener'], data);
        const listener = function (...args) {
          socket.emit(data.event, {args});
        }
        emitter.on(data.event, listener);
        listeners.push([data.event, listener]);
      }
    });
    socket.on('disconnect', function (data) {
      mainStory.debug('socket', `Socket #${socket.id} disconnected`, {attach: data});
      emitter.emit(['socket', 'connect'], {
        id: socket.id,
        reason: data.reason
      });

      listeners.forEach(([event, listener]) => {
        emitter.off(event, listener);
      });
    });
    
    socket.on('authenticate', ({token}) => {
      socket.on('emitter.emit', ({args, event}) => {
        mainStory.trace('socket', `emitter.emit ${event}`, {attach: args});
        emitter.emit(['socket', 'emit'], {args});
        emitter.emit(event, ...args);
      })
      socket.on('emitter.on', (data) => {
        mainStory.debug('socket', `emitter.on ${data.event}`, {attach: data});
        emitter.emit(['socket', 'addlistener'], data);
        const listener = function (...args) {
          socket.emit(data.event, {args});
        }
        emitter.on(data.event, listener);
        listeners.push([data.event, listener]);
      });
      socket.on('disconnect', function (data) {
        mainStory.debug('socket', `Socket #${socket.id} disconnected`, {attach: data});
        emitter.emit(['socket', 'connect'], {
          id: socket.id,
          reason: data.reason
        });

        listeners.forEach(([event, listener]) => {
          emitter.off(event, listener);
        });
      });
    });
  })
}
emitter.on(['server', 'ping'], () => {
  process.nextTick(() => {
    return emitter.emit(['client', 'pong']);
  })
});

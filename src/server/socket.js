const socketIO = require('socket.io');
const emitter = require('emitter');
const {mainStory} = require('storyboard');
const jwt            = require('jsonwebtoken');
const config          = require('config');

module.exports = function(app) {
  const io = socketIO(app);
  mainStory.info('socket', 'Injecting socket.io into app...');
  io.on('connection', function (socket) {
    mainStory.debug('socket', `Socket #${socket.id} connected`);
    emitter.emit(['socket', 'connect'], {
      id: socket.id
    });
    const listeners = [];
    let userConnected = false;
    socket.on('emitter.emit', ({args, event}) => {
      if (event === 'checks::socketiotest::pong' || userConnected) {
        emitter.emit(['socket', 'emit'], {args});
        emitter.emit(event, ...args);
      }
    })
    socket.on('emitter.on', (data) => {
        emitter.emit(['socket', 'addlistener'], data);
        const listener = function (...args) {
          if (data.event === 'checks::socketiotest::ping' || userConnected) {
            socket.emit(data.event, {args});
          }
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

    socket.on('authenticate', ({token}) => {
      try {
        const user = jwt.verify(token, config.get('jwtSecret'));
        mainStory.info('socket', `Successfully authenticated as ${user.username}`);
        userConnected = true;
      } catch (err) {
        mainStory.warn('socket', `Failed to authenticate connection`);
        return;
      }
    });
  })
}
emitter.on(['server', 'ping'], () => {
  process.nextTick(() => {
    return emitter.emit(['client', 'pong']);
  })
});

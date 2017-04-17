const semver     = require('semver');
const config      = require('config');
const {scgi}     = require('features/store/utils');
const emitter    = require('emitter');
const shortid    = require('shortid');
const fs         = require('fs-promise');
const path       = require('path');

const REQUIRED_NODE = '^7.7.0';

module.exports.checklist = [
  'node_version',
  'ssl',
  'rtorrent',
  'socketio_connected',
  'write_access'
]

module.exports.checks = {
  node_version: async function () {
    const works = semver.satisfies(process.version, REQUIRED_NODE);
    return {
      status: works ? 'ok' : 'ko',
      message: `You are running node ${process.version} (required: ${
        REQUIRED_NODE
      })`
    };
  },
  ssl: async function () {
    return {status: 'ok', message: 'Connection is secured by SSL (https)'};
  },
  rtorrent: async function () {
    const host = config.get('scgiHost');
    const port = config.get('scgiPort');
    try {
      const version = await scgi.methodCall('system.client_version', [], host, port);
      if (semver.valid(version)) {
        return {
          status: 'ok',
          message: `Connected to rtorrent on ${host}:${port} (rtorrent ${version})`
        };
      }
      return {
        status: 'ko',
        message: `Unable to connect to rtorrent on ${host}:${port})`,
        details: `Unexpected response: '${version}'. Is rtorrent running on this port?`
      };
    } catch (err) {
      return {
        status: 'ko',
        message: `Unable to connect to rtorrent on ${host}:${port}`,
        details: err.message
      };
    }
  },
  socketio_connected: function () {
    return new Promise((resolve, reject) => {
      const key = shortid.generate();
      const time = Date.now();
      let resolved = false;
      emitter.on(['checks', 'socketiotest', 'pong'], function (id) {
        if (key === id) {
          resolved = true;
          resolve({
            status: 'ok',
            message: `SocketIO connected in ${Date.now() - time}ms`
          });
        }
      });
      emitter.emit(['checks', 'socketiotest', 'ping']);
      setTimeout(() => {
        if (!resolved) {
          resolve({
            status: 'ko',
            message: `Can't connect socket.io instance`
          });
        }
      }, 6500);
    })
  },
  write_access: async function () {
    const file = path.join(config.get('configRoot'), 'testfile');
    const key = shortid.generate();
    try {
      await fs.writeFile(file, `testfile::${key}`);
      const res = await fs.readFile(file, 'utf8');
      await fs.unlink(file);
      const stillExists = await fs.exists(file);

      if (res === `testfile::${key}` && !stillExists) {
        return {
          status: 'ok',
          message: `${config.get('configRoot')} is writable by cassette`
        };
      }
      return {
        status: 'ko',
        message: `Can't write file ${file} for unknown reason`
      };
    } catch (err) {
      return {
        status: 'ko',
        message: `Can't write file ${file}`,
        details: err.message
      };
    }

  }
}

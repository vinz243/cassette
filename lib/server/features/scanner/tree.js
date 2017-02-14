'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeCachedEntries = exports.getCachedEntries = exports.getFolderEntries = undefined;

var _walkSync = require('walk-sync');

var _walkSync2 = _interopRequireDefault(_walkSync);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataDir = _path2.default.join(_config2.default.get('configPath'), '/fs/');
_mkdirp2.default.sync(dataDir);

var getFolderEntries = exports.getFolderEntries = function getFolderEntries(path) {
  return _walkSync2.default.entries(path);
};

var getCachedEntries = exports.getCachedEntries = function getCachedEntries(id) {
  var file = _path2.default.join(dataDir, 'fstree-' + id + '.json');
  return new Promise(function (resolve, reject) {
    _fs2.default.exists(file, function (exists) {
      if (!exists) {
        return resolve([]);
      }
      _fs2.default.readFile(file, function (err, data) {
        if (err) {
          return reject(err);
        }
        try {
          resolve(JSON.parse(data).entries);
        } catch (err) {
          reject(err);
        }
      });
    });
  });
};

var writeCachedEntries = exports.writeCachedEntries = function writeCachedEntries(id, entries) {
  var file = _path2.default.join(dataDir, 'fstree-' + id + '.json');
  return new Promise(function (resolve, reject) {
    _fs2.default.writeFile(file, JSON.stringify({ entries: entries }), function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
};
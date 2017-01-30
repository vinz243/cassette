'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RTorrent = undefined;

var _rTorrent = require('./rTorrent');

Object.defineProperty(exports, 'RTorrent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_rTorrent).default;
  }
});

var _endpoint = require('./endpoint');

var _endpoint2 = _interopRequireDefault(_endpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _endpoint2.default;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _endpoint = require('./endpoint');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_endpoint).default;
  }
});
Object.defineProperty(exports, 'api', {
  enumerable: true,
  get: function get() {
    return _endpoint.api;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
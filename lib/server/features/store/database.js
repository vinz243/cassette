'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pull = exports.push = undefined;

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {};
var push = exports.push = function push(key, value) {
  if (value) {
    data[key] = value;
    return push;
  }
  var id = _shortid2.default.generate();
  data[id] = key;
  return id;
};
var pull = exports.pull = function pull(key) {
  return data[key];
};
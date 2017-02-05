'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestSize = exports.sizesArray = exports.sizesMap = undefined;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sizesMap = exports.sizesMap = {
  small: 34,
  medium: 64,
  large: 174,
  extralarge: 300,
  mega: 600
};

var sizesArray = exports.sizesArray = Object.keys(sizesMap).map(function (key) {
  return {
    name: key,
    value: sizesMap[key]
  };
});

var getClosestSize = exports.getClosestSize = function getClosestSize(target) {
  var sizes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(sizesMap);

  (0, _assert2.default)(sizes.length > 0);
  return sizesArray.filter(function (s) {
    return sizes.includes(s.name);
  }).reduce(function (curr, val) {
    var delta = Math.abs(target - sizesMap[val.name]);
    if (Math.abs(target - sizesMap[curr]) > delta) return val.name;
    return curr;
  }, sizes[0]);
};
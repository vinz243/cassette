'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextCallDelay = nextCallDelay;
exports.expandObject = expandObject;
exports.expandArray = expandArray;

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function nextCallDelay(calls, max, timeFrame) {
  var now = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Date.now();

  var callsFromNow = calls.map(function (time) {
    return now - time;
  }).sort(function (a, b) {
    return a - b;
  });
  var lastCalls = callsFromNow.filter(function (time) {
    return time < timeFrame;
  });
  if (lastCalls.length - max >= 0) {
    return lastCalls[lastCalls.length - max];
  }
  return 0;
};

// This will expand a single object from one of its property
// {
//   a: 1,
//   b: [2, 3, 4]
// }
// will result in
// [{a:1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]
//
// keepObject determines wether the nested properties are kept nested

function expandObject(obj, property) {
  var keepObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  return (obj[property] || []).map(function (val) {
    return Object.assign({}, (0, _omit2.default)(obj, property), keepObject ? _defineProperty({}, property, val) : val);
  });
};
// Calls expandobject for each element
function expandArray(arr, property) {
  var keepObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


  return arr.map(function (el) {
    return expandObject(el, property, keepObject);
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []);
};
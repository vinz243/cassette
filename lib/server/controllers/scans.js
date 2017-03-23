'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Controller = require('./Controller');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _Scan = require('../models/Scan');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _merge2.default)({}, (0, _Controller.fetchable)('scan', _Scan.find, _Scan.findById), (0, _Controller.createable)('scan', _Scan.Scan));
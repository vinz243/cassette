'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _Controller2.default(_models.Album).done();

exports.default = routes;
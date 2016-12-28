'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedbPromise = require('nedb-promise');

var _nedbPromise2 = _interopRequireDefault(_nedbPromise);

var _config = require('../../../config.js');

var _config2 = _interopRequireDefault(_config);

var _config3 = require('./config.js');

var _config4 = _interopRequireDefault(_config3);

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// schema:
//   name: albumName
//   artistId: id of artistId
//   year: year

// import Artist from './Artist.js';

var Album = new _Model2.default('album').field('name').string().required().defaultParam().done().field('artistId').oneToOne()
// .required()
.done().field('year').int().done().noDuplicates().done();

exports.default = Album;
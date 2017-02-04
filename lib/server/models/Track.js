'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedbPromise = require('nedb-promise');

var _nedbPromise2 = _interopRequireDefault(_nedbPromise);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _File = require('./File');

var _File2 = _interopRequireDefault(_File);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Artist from './Artist.js';
var Track = new _Model2.default('track').field('name').defaultParam().required().string().done().field('duration').float().notIdentity().done().field('albumId').oneToOne().done().field('artistId').oneToOne().done().oneToMany(_File2.default, 'trackId').noDuplicates().done();

exports.default = Track;
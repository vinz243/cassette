'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

var _Artist = require('./Artist');

var _Artist2 = _interopRequireDefault(_Artist);

var _Album = require('./Album');

var _Album2 = _interopRequireDefault(_Album);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Schema:
//   _id: id of file
//   path: abs path to file
//   format: format
//   bitrate: audio bitrate in kbps
//   lossless: boolean
//   size: file size in bytes
//   duration: duration in ms
//   trackId: track id
//   albumId: album id
//   artistId: artist id

var File = new _Model2.default('file').field('path').defaultParam().required().string().done().field('bitrate').int().done().field('format').notIdentity().string().done().field('lossless').boolean().notIdentity().done().field('size').int().notIdentity().done().field('duration').int().notIdentity().done().field('trackId').oneToOne().done().field('artistId').oneToOne().done().field('albumId').oneToOne().done().done();

exports.default = File;
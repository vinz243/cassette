'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Artist = require('../models/Artist');

var _Album = require('../models/Album');

var _Track = require('../models/Track');

var _File = require('../models/File');

var _Controller = require('./Controller');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _merge2.default)({}, (0, _Controller.fetchable)('artist', _Artist.find, _Artist.findById), (0, _Controller.updateable)('artist', _Artist.findById), (0, _Controller.oneToMany)('artist', 'album', _Album.find), (0, _Controller.oneToMany)('artist', 'track', _Track.find), (0, _Controller.oneToMany)('artist', 'file', _File.find));
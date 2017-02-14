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

exports.default = (0, _merge2.default)({}, (0, _Controller.fetchable)('album', _Album.find, _Album.findById), (0, _Controller.updateable)('album', _Album.findById), (0, _Controller.oneToMany)('album', 'track', _Track.find), (0, _Controller.oneToMany)('album', 'file', _File.find));
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

var _default = Track;
exports.default = _default;
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Track, 'Track', 'src/server/models/Track.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/server/models/Track.js');
})();

;
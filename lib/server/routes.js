'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (router) {
  for (var route in routes) {
    for (var verb in routes[route]) {
      // console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
};

var _albums = require('./controllers/albums');

var _albums2 = _interopRequireDefault(_albums);

var _artists = require('./controllers/artists');

var _artists2 = _interopRequireDefault(_artists);

var _libraries = require('./controllers/libraries');

var _libraries2 = _interopRequireDefault(_libraries);

var _tracks = require('./controllers/tracks');

var _tracks2 = _interopRequireDefault(_tracks);

var _scans = require('./controllers/scans');

var _scans2 = _interopRequireDefault(_scans);

var _features = require('./features');

var _features2 = _interopRequireDefault(_features);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jobController from './controllers/job';

// import configController from './controllers/config';
var routes = {};
// import filesController from './controllers/files';


Object.assign(routes, _artists2.default, _albums2.default, _tracks2.default, _libraries2.default, _scans2.default);

Object.assign(routes, _features2.default);
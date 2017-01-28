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

var _config = require('./controllers/config');

var _config2 = _interopRequireDefault(_config);

var _libraries = require('./controllers/libraries');

var _libraries2 = _interopRequireDefault(_libraries);

var _tracks = require('./controllers/tracks');

var _tracks2 = _interopRequireDefault(_tracks);

var _files = require('./controllers/files');

var _files2 = _interopRequireDefault(_files);

var _features = require('./features');

var _features2 = _interopRequireDefault(_features);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jobController from './controllers/job';

var routes = {};

Object.assign(routes, _config2.default);
// Object.assign(routes, jobController);
Object.assign(routes, _artists2.default);
Object.assign(routes, _albums2.default);
Object.assign(routes, _libraries2.default);
Object.assign(routes, _tracks2.default);
Object.assign(routes, _files2.default);
Object.assign(routes, _features2.default);
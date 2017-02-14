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

var _features = require('./features');

var _features2 = _interopRequireDefault(_features);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jobController from './controllers/job';

var routes = {};

// Object.assign(routes, configController);
// Object.assign(routes, jobController);

// import filesController from './controllers/files';

// import configController from './controllers/config';
Object.assign(routes, _artists2.default, _albums2.default, _tracks2.default, _libraries2.default);
// Object.assign(routes, albumsController);
// Object.assign(routes, librariesController);
// Object.assign(routes, tracksController);
// Object.assign(routes, filesController);
// Object.assign(routes, features)
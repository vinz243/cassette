'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jobController from './controllers/job';

var routes = {};

(0, _assign2.default)(routes, _config2.default);
// Object.assign(routes, jobController);
(0, _assign2.default)(routes, _artists2.default);
(0, _assign2.default)(routes, _albums2.default);
(0, _assign2.default)(routes, _libraries2.default);
(0, _assign2.default)(routes, _tracks2.default);
(0, _assign2.default)(routes, _files2.default);

var _default = function _default(router) {
  for (var route in routes) {
    for (var verb in routes[route]) {
      // console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
};

exports.default = _default;
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(routes, 'routes', 'src/server/routes.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/server/routes.js');
})();

;
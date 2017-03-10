'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.fetchEntityArtworkFactory = fetchEntityArtworkFactory;
exports.agentFactory = agentFactory;

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _config = require('../../config.js');

var _config2 = _interopRequireDefault(_config);

var _storyboard = require('storyboard');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _sizes = require('./sizes');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function fetchEntityArtwork(fs, path, touch, request, qs, md5, conf, entity, entityName, parent) {

  (0, _assert2.default)(['artist', 'album'].includes(entity));

  if (!entityName) {
    return Promise.resolve();
  }

  var dataDir = path.join(_config2.default.get('configPath'), 'artworks');
  _mkdirp2.default.sync(dataDir);

  var hash = md5(qs.stringify(_defineProperty({
    entity: entity + '_artwork'
  }, entity, entityName)));

  var filePath = path.join(dataDir, hash);

  if (fs.existsSync(filePath)) {
    _storyboard.mainStory.trace('artwork-agent', 'Artwork for ' + entityName + ' already exists');
    return Promise.resolve();
  } else {
    var _ret = function () {
      var _Object$assign;

      // This creates the file at specified path, like a lock file
      touch.sync(filePath);

      _storyboard.mainStory.info('artwork-agent', 'Trying to find artwork for ' + entityName);

      var params = Object.assign({}, (_Object$assign = {
        method: entity + '.getinfo',
        api_key: _config2.default.get('lastFMAPIKey')
      }, _defineProperty(_Object$assign, entity, entityName), _defineProperty(_Object$assign, 'format', 'json'), _Object$assign), parent ? { artist: parent } : {});

      var url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);
      var time = Date.now();
      return {
        v: request(url).then(function (json) {
          // Log time
          _storyboard.mainStory.info('artwork-agent', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - time) + 'ms');

          var data = JSON.parse(json);
          if (data.error) {
            return Promise.resolve([]);
          }
          // Create a list of available sizes
          // We remove the mega size because it isn't a regular square
          var availableSizes = data[entity].image.map(function (s) {
            return s.size;
          }).filter(function (size) {
            return size !== 'mega';
          });

          if (!availableSizes.length) {
            return Promise.resolve([]);
          }

          // Try to find the largest size
          var target = (0, _sizes.getClosestSize)(1200, availableSizes);

          // Get corresponding url
          var imageUrl = data[entity].image.find(function (el) {
            return el.size === target;
          })['#text'];
          // if nothing found, resolve empty
          if (!imageUrl) {
            return Promise.resolve([]);
          }

          // Try to fetch image
          return request({
            url: imageUrl, encoding: null
          }).then(function (buffer) {
            return Promise.resolve([buffer, Date.now(), imageUrl]);
          });
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              buffer = _ref2[0],
              date = _ref2[1],
              url = _ref2[2];

          // No buffer, image does not exists
          if (!buffer) {
            _storyboard.mainStory.warn('artwork-agent', 'No artwork found for ' + entityName);
            return Promise.resolve();
          }

          _storyboard.mainStory.info('artwork-agent', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - date) + 'ms');

          // Save image to disk
          return fs.writeFile(filePath, buffer).then(function () {
            return Promise.resolve();
          });
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
}

function fetchEntityArtworkFactory(fsp, path, touch, request, qs, md5, conf) {
  return fetchEntityArtwork.bind(null, fsp, path, touch, request, qs, md5, conf);
}

function agent(fetchArtwork) {
  return function (metadata, next) {
    next();
    process.nextTick(function () {
      var album = function album() {
        fetchArtwork('album', metadata.album, metadata.artist);
      };
      fetchArtwork('artist', metadata.artist).then(album);
    });
  };
}

function agentFactory(fetch) {
  return agent.bind(null, fetch);
}
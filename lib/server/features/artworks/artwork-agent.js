'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.fetchArtistArtworkFactory = fetchArtistArtworkFactory;
exports.agent = agent;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOpts = {
  apiKey: '85d5b036c6aa02af4d7216af592e1eea'
};

function fetchArtistArtwork(fs, path, touch, request, qs, md5, conf, artist) {
  if (!artist) {
    return Promise.resolve();
  }

  var dataDir = path.join(_config2.default.get('configPath'), 'artworks');
  _mkdirp2.default.sync(dataDir);

  var hash = md5(qs.stringify({
    entity: 'artist_artwork',
    artist: artist
  }));

  var filePath = path.join(dataDir, hash);

  if (fs.existsSync(filePath)) {
    _storyboard.mainStory.trace('artwork-agent', 'Artwork for ' + artist + ' already exists');
    return Promise.resolve();
  } else {
    (function () {
      // This creates the file at specified path, like a lock file
      touch.sync(filePath);

      _storyboard.mainStory.info('artwork-agent', 'Trying to find artwork for ' + artist);

      var params = {
        method: 'artist.getinfo',
        api_key: conf.get('lastFMAPIKey'),
        artist: artist,
        format: 'json'
      };

      var url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);
      var time = Date.now();

      var json = request(url).then(function (json) {

        // Log time
        _storyboard.mainStory.info('artwork-agent', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - time) + 'ms');

        var data = JSON.parse(json);

        // Create a list of available sizes
        var availableSizes = data.artist.image.map(function (s) {
          return s.size;
        });
        if (availableSizes.length === 0) {
          return Promise.resolve([]);
        }

        // Try to find the largest size
        var target = getClosestSize(1200, availableSizes);

        // Get corresponding url
        var imageUrl = data.artist.image.find(function (el) {
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
          return Promise.resolve([buffer, Date.now()]);
        });
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            buffer = _ref2[0],
            date = _ref2[1];

        // No buffer, image does not exists
        if (!buffer) {
          _storyboard.mainStory.warn('artwork-agent', 'No artwork found for ' + artist);
          return Promise.resolve();
        }

        _storyboard.mainStory.info('artwork-agent', 'GET ' + _chalk2.default.dim(imageUrl) + ' - ' + (Date.now() - date) + 'ms');

        // Save image to disk
        return fs.writeFile(filePath, buffer).then(function () {
          return Promise.resolve();
        });
      });
    })();
  }
}

function fetchArtistArtworkFactory(fsp, path, touch, request, qs, md5, conf) {
  return fetchArtistArtwork.bind(null, fsp, path, touch, request, qs, md5, conf);
}

function agent(fetchArtistArtwork, fetchAlbumArtwork, options) {
  return function (metadata, next) {
    var opts = (0, _defaults2.default)(options, defaultOpts);

    process.nextTick(function () {
      fetchArtistArtwork(metadata.artist).then(function () {
        return fetchAlbumArtwork(metadata.album);
      });
    });
    next();
  };
}

function agentFactory(fetchArtistArtwork, fetchAlbumArtwork) {
  return agent.bind(null, fetchArtistArtwork, fetchAlbumArtwork);
}
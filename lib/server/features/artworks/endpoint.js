'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sizes = require('./sizes');

var _Album = require('../../models/Album');

var _Artist = require('../../models/Artist');

var _config = require('../../config.js');

var _config2 = _interopRequireDefault(_config);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _storyboard = require('storyboard');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dataDir = _path2.default.join(_config2.default.get('configPath'), '/cache/artworks');
_mkdirp2.default.sync(dataDir);

exports.default = {
  '/api/v2/albums/:id/artwork': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var _ctx$request$query$si, size, album, hash, cachePath, params, url, time, json, data, availableSizes, target, imageUrl, buffer;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ctx$request$query$si = ctx.request.query.size, size = _ctx$request$query$si === undefined ? 300 : _ctx$request$query$si;
                _context.next = 3;
                return (0, _Album.findById)(ctx.params.id);

              case 3:
                album = _context.sent;

                if (album) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', ctx.throw(404, 'Album not found'));

              case 6:

                // Generate unique cache per album
                hash = (0, _md2.default)(_querystring2.default.stringify({
                  action: 'get_album_art',
                  size: size,
                  id: album.props._id,
                  album: album.props.name
                }));

                // First check cache

                cachePath = _path2.default.join(dataDir, hash);

                if (!_fs2.default.existsSync(cachePath)) {
                  _context.next = 16;
                  break;
                }

                _context.next = 11;
                return new Promise(function (resolve, reject) {
                  return _fs2.default.readFile(cachePath, function (err, data) {
                    if (err) {
                      _storyboard.mainStory.error('artwork', 'reading \'' + cachePath + '\' failed', { attach: err });
                      return reject(err);
                    }
                    resolve(data);
                  });
                });

              case 11:
                ctx.body = _context.sent;

                _storyboard.mainStory.info('artwork', 'sending cached album artwork');
                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');
                return _context.abrupt('return');

              case 16:

                // Otherwise prepare Last.FM query
                params = {
                  method: 'album.getinfo',
                  api_key: '85d5b036c6aa02af4d7216af592e1eea',
                  artist: album.props.artist.name,
                  album: album.props.name,
                  format: 'json'
                };
                url = 'http://ws.audioscrobbler.com/2.0/?' + _querystring2.default.stringify(params);
                time = Date.now();
                _context.next = 21;
                return (0, _requestPromiseNative2.default)(url);

              case 21:
                json = _context.sent;


                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - time) + 'ms');

                data = JSON.parse(json);
                availableSizes = data.album.image.map(function (s) {
                  return s.size;
                });

                if (!(availableSizes.length === 0)) {
                  _context.next = 27;
                  break;
                }

                return _context.abrupt('return', ctx.throws(404));

              case 27:
                target = (0, _sizes.getClosestSize)(size, availableSizes);
                imageUrl = data.album.image.find(function (el) {
                  return el.size === target;
                })['#text'] || 'http://lorempixel.com/g/' + size + '/' + size;


                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');

                _context.next = 33;
                return (0, _requestPromiseNative2.default)({
                  url: imageUrl, encoding: null
                });

              case 33:
                buffer = _context.sent;


                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(imageUrl) + ' - ' + (Date.now() - time) + 'ms');

                ctx.body = buffer;

                _fs2.default.writeFile(cachePath, buffer, function (err) {
                  if (err) {
                    return _storyboard.mainStory.error('artwork', 'could not write to cache artwork (' + cachePath + ')', {
                      attach: err
                    });
                  }
                  return _storyboard.mainStory.info('artwork', 'cached artwork for next time');
                });

              case 37:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function get(_x) {
        return _ref.apply(this, arguments);
      };
    }()
  },
  '/api/v2/artists/:id/artwork': {
    get: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var _ctx$request$query$si2, size, artist, hash, cachePath, params, url, time, json, data, availableSizes, target, imageUrl, time2, buffer;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ctx$request$query$si2 = ctx.request.query.size, size = _ctx$request$query$si2 === undefined ? 300 : _ctx$request$query$si2;
                _context2.next = 3;
                return (0, _Artist.findById)(ctx.params.id);

              case 3:
                artist = _context2.sent;

                if (artist) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt('return', ctx.throw(404));

              case 6:
                hash = (0, _md2.default)(_querystring2.default.stringify({
                  action: 'get_artist_art',
                  size: size,
                  id: artist.props._id,
                  name: artist.props.name
                }));
                cachePath = _path2.default.join(dataDir, hash);

                if (!_fs2.default.existsSync(cachePath)) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 11;
                return new Promise(function (resolve, reject) {
                  return _fs2.default.readFile(cachePath, function (err, data) {
                    if (err) {
                      _storyboard.mainStory.error('artwork', 'reading \'' + cachePath + '\' failed', { attach: err });
                      return reject(err);
                    }
                    resolve(data);
                  });
                });

              case 11:
                ctx.body = _context2.sent;

                _storyboard.mainStory.info('artwork', 'sending cached album artwork');
                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');
                return _context2.abrupt('return');

              case 16:
                params = {
                  method: 'artist.getinfo',
                  api_key: '85d5b036c6aa02af4d7216af592e1eea',
                  artist: artist.data.name,
                  format: 'json'
                };
                url = 'http://ws.audioscrobbler.com/2.0/?' + _querystring2.default.stringify(params);
                time = Date.now();
                _context2.next = 21;
                return (0, _requestPromiseNative2.default)(url);

              case 21:
                json = _context2.sent;


                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - time) + 'ms');
                data = JSON.parse(json);
                availableSizes = data.artist.image.map(function (s) {
                  return s.size;
                });

                if (!(availableSizes.length === 0)) {
                  _context2.next = 27;
                  break;
                }

                return _context2.abrupt('return', ctx.throws(404));

              case 27:
                target = (0, _sizes.getClosestSize)(size, availableSizes);
                imageUrl = data.artist.image.find(function (el) {
                  return el.size === target;
                })['#text'] || 'http://lorempixel.com/g/' + size + '/' + size;


                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');

                time2 = Date.now();
                _context2.next = 34;
                return (0, _requestPromiseNative2.default)({
                  url: imageUrl, encoding: null
                });

              case 34:
                buffer = _context2.sent;

                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(imageUrl) + ' - ' + (Date.now() - time2) + 'ms');
                ctx.body = buffer;
                _fs2.default.writeFile(cachePath, buffer, function (err) {
                  if (err) {
                    return _storyboard.mainStory.error('artwork', 'could not write to cache artwork (' + cachePath + ')', {
                      attach: err
                    });
                  }
                  return _storyboard.mainStory.info('artwork', 'cached artwork for next time');
                });

              case 38:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function get(_x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  }
};
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

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dataDir = _path2.default.join(_config2.default.get('configPath'), 'artworks');

exports.default = {
  '/api/v2/albums/:id/artwork': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var _ctx$request$query$si, size, album, hash, filePath;

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
                  entity: 'album_artwork',
                  album: album.props.name
                }));
                filePath = _path2.default.join(dataDir, hash);

                if (!_fs2.default.existsSync(filePath)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 11;
                return new Promise(function (resolve, reject) {
                  return _fs2.default.readFile(filePath, function (err, data) {
                    if (err) {
                      _storyboard.mainStory.error('artwork', 'reading \'' + cachePath + '\' failed', { attach: err });
                      return reject(err);
                    }
                    resolve((0, _sharp2.default)(data).resize(size - 0, size - 0).toBuffer());
                  });
                });

              case 11:
                ctx.body = _context.sent;

                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');
                return _context.abrupt('return');

              case 15:
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
        var _ctx$request$query$si2, size, artist, hash, filePath;

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

                return _context2.abrupt('return', ctx.throw(404, 'Album not found'));

              case 6:

                // Generate unique cache per artist
                hash = (0, _md2.default)(_querystring2.default.stringify({
                  entity: 'artist_artwork',
                  artist: artist.props.name
                }));
                filePath = _path2.default.join(dataDir, hash);

                if (!_fs2.default.existsSync(filePath)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 11;
                return new Promise(function (resolve, reject) {
                  return _fs2.default.readFile(filePath, function (err, data) {
                    if (err) {
                      _storyboard.mainStory.error('artwork', 'reading \'' + cachePath + '\' failed', { attach: err });
                      return reject(err);
                    }
                    resolve((0, _sharp2.default)(data).resize(size - 0, size - 0).toBuffer());
                  });
                });

              case 11:
                ctx.body = _context2.sent;

                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');
                return _context2.abrupt('return');

              case 15:
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
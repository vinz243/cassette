'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sizes = require('./sizes');

var _models = require('../../models');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _storyboard = require('storyboard');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  '/v1/albums/:id/art': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var _ctx$request$query$si, size, album, params, url, time, json, data, availableSizes, target, imageUrl;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ctx$request$query$si = ctx.request.query.size, size = _ctx$request$query$si === undefined ? 300 : _ctx$request$query$si;
                _context.next = 3;
                return _models.Album.findById(ctx.params.id);

              case 3:
                album = _context.sent;

                if (album) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', ctx.throw(404));

              case 6:
                _context.next = 8;
                return _models.Artist.findById(album.data.artistId);

              case 8:
                _context.t0 = _context.sent.data.name;
                _context.t1 = album.data.name;
                params = {
                  method: 'album.getinfo',
                  api_key: '85d5b036c6aa02af4d7216af592e1eea',
                  artist: _context.t0,
                  album: _context.t1,
                  format: 'json'
                };
                url = 'http://ws.audioscrobbler.com/2.0/?' + _querystring2.default.stringify(params);
                time = Date.now();
                _context.next = 15;
                return (0, _requestPromiseNative2.default)(url);

              case 15:
                json = _context.sent;

                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(url) + ' - ' + (Date.now() - time) + 'ms');
                data = JSON.parse(json);
                availableSizes = data.album.image.map(function (s) {
                  return s.size;
                });

                if (!(availableSizes.length === 0)) {
                  _context.next = 21;
                  break;
                }

                return _context.abrupt('return', ctx.throws(404));

              case 21:
                target = (0, _sizes.getClosestSize)(size, availableSizes);
                imageUrl = data.album.image.find(function (el) {
                  return el.size === target;
                })['#text'];


                ctx.status = 200;
                ctx.set('Content-Type', 'image/png');
                _context.next = 27;
                return (0, _requestPromiseNative2.default)({
                  url: imageUrl, encoding: null
                });

              case 27:
                ctx.body = _context.sent;

                _storyboard.mainStory.info('artwork', 'GET ' + _chalk2.default.dim(imageUrl) + ' - ' + (Date.now() - time) + 'ms');

              case 29:
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
  }
};
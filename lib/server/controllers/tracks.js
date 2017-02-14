'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Artist = require('../models/Artist');

var _Album = require('../models/Album');

var _Track = require('../models/Track');

var _File = require('../models/File');

var _Controller = require('./Controller');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (0, _merge2.default)({}, (0, _Controller.fetchable)('track', _Track.find, _Track.findById), (0, _Controller.updateable)('track', _Track.findById), (0, _Controller.oneToMany)('track', 'file', _File.find), {
  '/api/v2/tracks/:id/stream': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var tracks, stat, mimeType, opts, code, _ctx$headers$range$sp, _ctx$headers$range$sp2, b, range, _range$split, _range$split2, start, end;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _File.find)({
                  track: ctx.params.id,
                  sort: 'bitrate',
                  direction: 'desc',
                  limit: 3
                });

              case 2:
                tracks = _context.sent;

                if (!(tracks.length == 0)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', ctx.throw(404, 'No file found'));

              case 5:
                stat = fs.statSync(tracks[0].data.path);
                mimeType = 'audio/mpeg';


                if (tracks[0].data.path.endsWith('.flac')) {
                  mimeType = 'audio/flac';
                }

                opts = {}, code = 200;


                ctx.set('Content-Type', mimeType);
                ctx.set('Content-Length', stat.size);
                ctx.set('Accept-Ranges', 'bytes');

                if (ctx.headers['range']) {
                  _ctx$headers$range$sp = ctx.headers['range'].split('='), _ctx$headers$range$sp2 = _slicedToArray(_ctx$headers$range$sp, 2), b = _ctx$headers$range$sp2[0], range = _ctx$headers$range$sp2[1];


                  if (b === 'bytes') {
                    _range$split = range.split('-'), _range$split2 = _slicedToArray(_range$split, 2), start = _range$split2[0], end = _range$split2[1];


                    if (!end || end === '' || end < start) end = stat.size - 1;

                    opts = {
                      start: start - 0,
                      end: end - 0
                    };

                    code = 206;
                    ctx.set('Content-Range', 'bytes ' + start + '-' + end + '/' + stat.size);
                    ctx.set('Content-Length', end - start + 1);
                  }
                }
                ctx.status = code;
                ctx.body = fs.createReadStream(tracks[0].data.path, opts);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function get(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
});
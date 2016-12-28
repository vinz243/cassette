'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _models = require('../models');

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var routes = new _Controller2.default(_models.Track).done();

routes['/v1/tracks/:id/file'] = {
  get: function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var tracks, stat, mimeType, opts, res, resHeaders, _ctx$headers$range$sp, _ctx$headers$range$sp2, b, range, _range$split, _range$split2, start, end;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _models.File.find({
                trackId: ctx.params.id,
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

              return _context.abrupt('return', res.writeHead(404, {}));

            case 5:
              stat = _fs2.default.statSync(tracks[0].data.path);
              mimeType = 'audio/mpeg';


              if (tracks[0].data.path.endsWith('.flac')) {
                mimeType = 'audio/flac';
              }

              opts = {}, res = 200;
              resHeaders = {
                'Content-Type': mimeType,
                'Content-Length': stat.size,
                'Accept-Ranges': 'bytes'
              };
              // console.log(ctx.headers);
              // if (ctx.headers.accept !== '*/*') {
              //   ctx.res.writeHead(200, resHeaders);
              //   return;
              // }

              if (ctx.headers['range']) {
                _ctx$headers$range$sp = ctx.headers['range'].split('='), _ctx$headers$range$sp2 = _slicedToArray(_ctx$headers$range$sp, 2), b = _ctx$headers$range$sp2[0], range = _ctx$headers$range$sp2[1];


                if (b === 'bytes') {
                  _range$split = range.split('-'), _range$split2 = _slicedToArray(_range$split, 2), start = _range$split2[0], end = _range$split2[1];


                  if (!end || end === '' || end < start) end = stat.size - 1;

                  opts = {
                    start: start - 0,
                    end: end - 0
                  };

                  res = 206;
                  resHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
                  resHeaders['Content-Length'] = end - start + 1;
                }
              }

              ctx.res.writeHead(res, resHeaders);

              ctx.body = _fs2.default.createReadStream(tracks[0].data.path, opts);

              // readStream.pipe(ctx.res);

            case 13:
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
};
exports.default = routes;
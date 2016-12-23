'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _models = require('../models');

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _Controller2.default(_models.Track).done();

routes['/v1/tracks/:id/file'] = {
  get: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
      var tracks, stat, mimeType, opts, res, resHeaders, _ctx$headers$range$sp, _ctx$headers$range$sp2, b, range, _range$split, _range$split2, start, end;

      return _regenerator2.default.wrap(function _callee$(_context) {
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
                _ctx$headers$range$sp = ctx.headers['range'].split('='), _ctx$headers$range$sp2 = (0, _slicedToArray3.default)(_ctx$headers$range$sp, 2), b = _ctx$headers$range$sp2[0], range = _ctx$headers$range$sp2[1];

                console.log(b, range);
                if (b === 'bytes') {
                  _range$split = range.split('-'), _range$split2 = (0, _slicedToArray3.default)(_range$split, 2), start = _range$split2[0], end = _range$split2[1];


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

              console.log(opts, resHeaders);
              ctx.res.writeHead(res, resHeaders);

              ctx.body = _fs2.default.createReadStream(tracks[0].data.path, opts);

              // readStream.pipe(ctx.res);

            case 14:
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
var _default = routes;
exports.default = _default;
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(routes, 'routes', 'src/server/controllers/tracks.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/server/controllers/tracks.js');
})();

;
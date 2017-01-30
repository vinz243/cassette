'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LastFM = require('./LastFM');

var _LastFM2 = _interopRequireDefault(_LastFM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var lastFM = new _LastFM2.default();

exports.default = {
  '/v1/store/searches': {
    post: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var body, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                body = ctx.request.fields || ctx.request.body || {};
                _context.next = 3;
                return Promise.all([lastFM.searchTrack(body.query, body.limit, body.page).then(_LastFM2.default.parseResult), lastFM.searchAlbum(body.query, body.limit, body.page).then(_LastFM2.default.parseResult)]);

              case 3:
                res = _context.sent;


                ctx.status = 201;
                ctx.body = {
                  payload: {
                    body: body
                  },
                  success: true,
                  data: {
                    tracks: res[0],
                    albums: res[1]
                  }
                };

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function post(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
};
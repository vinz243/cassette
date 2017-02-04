'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rTorrent = require('./rTorrent');

var _rTorrent2 = _interopRequireDefault(_rTorrent);

var _config = require('../../config.js');

var _config2 = _interopRequireDefault(_config);

var _database = require('../store/database');

var _indexers = require('../indexers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rTorrent = new _rTorrent2.default();

exports.default = {
  '/v1/releases/:id/downloads': {
    post: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var release, raw, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                release = (0, _database.pull)(ctx.params.id);

                if (release) {
                  _context.next = 5;
                  break;
                }

                ctx.status = 404;
                ctx.body = {
                  payload: { params: { id: ctx.params.id } },
                  sucess: false,
                  data: {}
                };
                return _context.abrupt('return');

              case 5:
                _context.next = 7;
                return _indexers.api.getRawTorrent(release.torrentId);

              case 7:
                raw = _context.sent;
                _context.next = 10;
                return rTorrent.addTorrent(raw);

              case 10:
                res = _context.sent;

                ctx.status = 201;
                ctx.body = {
                  payload: {
                    params: {
                      id: ctx.params.id
                    }
                  },
                  sucess: true,
                  data: {}
                };

              case 13:
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
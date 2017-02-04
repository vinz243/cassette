'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _GazelleAPI = require('./GazelleAPI');

var _GazelleAPI2 = _interopRequireDefault(_GazelleAPI);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _database = require('../store/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var api = exports.api = new _GazelleAPI2.default({
  username: _config2.default.pthUsername,
  password: _config2.default.pthPassword
});

exports.default = {
  '/v1/store/:id/releases': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var data, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = (0, _database.pull)(ctx.params.id);

                if (data) {
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
                return api.login().then(function () {
                  return api.searchTorrents(data.name);
                });

              case 7:
                res = _context.sent;

                ctx.status = 200;
                ctx.body = {
                  payload: {
                    params: {
                      id: ctx.params.id
                    }
                  },
                  sucess: true,
                  data: res.map(function (r) {
                    return r.data;
                  })
                };

              case 10:
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
};
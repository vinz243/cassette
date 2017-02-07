'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _JobTorrent = require('./JobTorrent');

var _JobTorrent2 = _interopRequireDefault(_JobTorrent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {

  '/v1/jobs': {

    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Promise.all(_JobTorrent2.default.find({}).map(function (j) {
                  return j.getData();
                }));

              case 2:
                res = _context.sent;

                ctx.body = {
                  success: true,
                  data: res
                };
                ctx.status = 200;

              case 5:
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
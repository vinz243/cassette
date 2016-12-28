'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../models/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var routes = {
  '/v1/config/:key': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var value;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _config2.default.getValue(ctx.params.key);

              case 2:
                value = _context.sent;

                // console.log("value", value);
                ctx.body = {
                  status: 200,
                  success: true,
                  data: value
                };
                ctx.status = 200;
                return _context.abrupt('return');

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return get;
    }(),
    put: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var fields;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fields = ctx.request.fields || ctx.request.body || {};
                // console.log('keys', ctx.params);

                _context2.next = 3;
                return _config2.default.updateValue(ctx.params.key, fields.value);

              case 3:
                ctx.body = _context2.sent;

                ctx.status = ctx.body.status;
                return _context2.abrupt('return');

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function put(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return put;
    }()
  },
  '/v1/config': {
    post: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
        var fields;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // console.log('posting config');
                fields = ctx.request.fields || ctx.request.body || {};
                _context3.next = 3;
                return _config2.default.insertValue(fields.key, fields.value);

              case 3:
                ctx.body = _context3.sent;

                ctx.status = ctx.body.status;
                return _context3.abrupt('return');

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function post(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return post;
    }()
  }
};

exports.default = routes;
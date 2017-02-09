'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _package = require('../../../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  '/v1/versions': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var url, json, data, latest, current, versions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = 'https://registry.npmjs.org/node-cassette';
                _context.next = 3;
                return _requestPromiseNative2.default.get(url);

              case 3:
                json = _context.sent;
                data = JSON.parse(json);
                latest = data['dist-tags'].latest;
                current = _package2.default.version;
                versions = Object.keys(data['versions']).map(function (v) {
                  return {
                    name: v,
                    current: v === current,
                    latest: v === latest,
                    newer: _semver2.default.gt(v, current)
                  };
                });


                ctx.status = 200;
                ctx.body = {
                  success: true,
                  status: 200,
                  data: versions
                };
                return _context.abrupt('return');

              case 11:
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
  '/v1/restart': {
    post: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var url, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = process.argv[process.argv.length - 1];
                _context2.next = 3;
                return _requestPromiseNative2.default.post(url + '/restart');

              case 3:
                res = _context2.sent;

                ctx.body = res;

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function post(_x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  },
  '/v1/update': {
    post: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        var url, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = process.argv[process.argv.length - 1];
                _context3.next = 3;
                return _requestPromiseNative2.default.post(url + '/update');

              case 3:
                res = _context3.sent;

                ctx.body = res;
                ctx.status = 201;

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function post(_x3) {
        return _ref3.apply(this, arguments);
      };
    }()
  }
};
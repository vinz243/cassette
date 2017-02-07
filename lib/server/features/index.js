'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _indexers = require('./indexers');

var _indexers2 = _interopRequireDefault(_indexers);

var _downloaders = require('./downloaders');

var _downloaders2 = _interopRequireDefault(_downloaders);

var _artworks = require('./artworks');

var _artworks2 = _interopRequireDefault(_artworks);

var _jobs = require('./jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _package = require('../../../package.json');

var _package2 = _interopRequireDefault(_package);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = Object.assign({}, _store2.default, _indexers2.default, _downloaders2.default, _artworks2.default, _jobs2.default, {
  '/v1/updates': {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var url, json, data, latest, current;
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

                if (!_semver2.default.gt(latest, current)) {
                  _context.next = 11;
                  break;
                }

                ctx.status = 200;
                ctx.body = {
                  success: true,
                  data: [{
                    version: data['dist-tags'].latest
                  }]
                };
                return _context.abrupt('return');

              case 11:
                ctx.status = 200;
                ctx.body = {
                  success: true,
                  data: []
                };

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function get(_x) {
        return _ref.apply(this, arguments);
      };
    }(),
    post: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var url, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = process.argv[process.argv.length - 1];
                _context2.next = 3;
                return _requestPromiseNative2.default.post(url + '/update');

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
  '/v1/restart': {
    post: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        var url, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = process.argv[process.argv.length - 1];
                _context3.next = 3;
                return _requestPromiseNative2.default.post(url + '/restart');

              case 3:
                res = _context3.sent;

                ctx.body = res;

              case 5:
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
  },
  '/v1/update': {
    post: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
        var url, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = process.argv[process.argv.length - 1];
                _context4.next = 3;
                return _requestPromiseNative2.default.post(url + '/update');

              case 3:
                res = _context4.sent;

                ctx.body = res;
                ctx.status = 201;

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function post(_x4) {
        return _ref4.apply(this, arguments);
      };
    }()
  }
});
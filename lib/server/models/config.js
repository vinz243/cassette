'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedbPromise = require('nedb-promise');

var _nedbPromise2 = _interopRequireDefault(_nedbPromise);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dataDir = _path2.default.join(_config2.default.get('configPath'), '/data/');
_mkdirp2.default.sync(dataDir);

var db = new _nedbPromise2.default(_path2.default.join(dataDir, '/config.db'));
db.loadDatabase();

var model = {

  getValue: function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key) {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return db.find({
                key: key
              });

            case 2:
              res = _context.sent;

              if (!(res.length == 0)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', {});

            case 5:
              return _context.abrupt('return', {
                key: res[0].key,
                value: res[0].value
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function getValue(_x) {
      return _ref.apply(this, arguments);
    };
  }(),

  get: function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key, defVal) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return model.getValue(key);

            case 2:
              _context2.t0 = _context2.sent.value;

              if (_context2.t0) {
                _context2.next = 5;
                break;
              }

              _context2.t0 = defVal;

            case 5:
              return _context2.abrupt('return', _context2.t0);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function get(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }(),
  updateValue: function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(key, value) {
      var found;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return db.find({ key: key });

            case 2:
              found = _context3.sent;

              if (!(found.length == 0)) {
                _context3.next = 5;
                break;
              }

              return _context3.abrupt('return', {
                success: false,
                status: 404,
                data: {
                  error_message: 'Cannot find key',
                  error_code: 'ENOTFOUND'
                }
              });

            case 5:
              _context3.next = 7;
              return db.update({
                key: key
              }, {
                key: key,
                value: value
              });

            case 7:
              return _context3.abrupt('return', {
                status: 200,
                success: true,
                data: {}
              });

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function updateValue(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }(),
  /*
   Inserts a value to database. Return complex object for API
   */
  insertValue: function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key, value) {
      var doc;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              doc = {
                key: key,
                value: value
              };
              _context4.next = 3;
              return db.find({ key: key });

            case 3:
              _context4.t0 = _context4.sent.length;

              if (!(_context4.t0 > 0)) {
                _context4.next = 6;
                break;
              }

              return _context4.abrupt('return', {
                success: false,
                status: 400,
                data: {
                  error_message: 'A config entry already exists with this key',
                  error_code: 'EDUPENTRY'
                }
              });

            case 6:
              _context4.next = 8;
              return db.insert(doc);

            case 8:
              return _context4.abrupt('return', {
                status: 201,
                success: true,
                data: {}
              });

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function insertValue(_x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  }()
};
exports.default = model;
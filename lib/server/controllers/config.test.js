'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _supertestKoaAgent = require('supertest-koa-agent');

var _supertestKoaAgent2 = _interopRequireDefault(_supertestKoaAgent);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _supertestAsPromised = require('supertest-as-promised');

var _supertestAsPromised2 = _interopRequireDefault(_supertestAsPromised);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _server = require('../server.js');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _supertestAsPromised2.default)(_server2.default);

(0, _ava2.default)('rootDir is a temp dir different from baseDir', function (t) {
  t.not(_config2.default.rootDir, _config2.default.baseDir);
});

_ava2.default.serial('server can post to create new config entry', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            t.plan(2);

            _context.next = 3;
            return request.post('/v1/config').send({
              key: 'foo',
              value: '42'
            }).expect(201);

          case 3:
            res = _context.sent;

            t.is(res.status, 201);
            t.deepEqual(res.body, {
              success: true,
              status: 201,
              data: {}
            });

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

_ava2.default.serial('can fetch config entry', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var res2;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            t.plan(2);
            _context2.next = 3;
            return request.get('/v1/config/foo').expect(200);

          case 3:
            res2 = _context2.sent;

            t.is(res2.status, 200);
            t.deepEqual(res2.body, {
              success: true,
              status: 200,
              data: {
                key: 'foo',
                value: '42'
              }
            });

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
_ava2.default.serial('won\'t create two config entry for same key', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var res, res2;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            t.plan(4);

            _context3.next = 3;
            return request.post('/v1/config').send({
              key: 'foo',
              value: 'Bilbo Baggins'
            }).expect(400);

          case 3:
            res = _context3.sent;

            t.is(res.status, 400);
            t.deepEqual(res.body, {
              success: false,
              status: 400,
              data: {
                error_message: 'A config entry already exists with this key',
                error_code: 'EDUPENTRY'
              }
            });

            _context3.next = 8;
            return request.get('/v1/config/foo').expect(200);

          case 8:
            res2 = _context3.sent;

            t.is(res2.status, 200);
            t.deepEqual(res2.body, {
              success: true,
              status: 200,
              data: {
                key: 'foo',
                value: '42'
              }
            });

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

_ava2.default.serial('can update a value', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            t.plan(2);
            _context4.next = 3;
            return request.put('/v1/config/foo').send({
              value: '1337'
            });

          case 3:
            res = _context4.sent;


            t.is(res.status, 200);
            t.deepEqual(res.body, {
              success: true,
              status: 200,
              data: {}
            });

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());

_ava2.default.serial('new value is upated', function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(t) {
    var res;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            t.plan(2);
            _context5.next = 3;
            return request.get('/v1/config/foo').expect(200);

          case 3:
            res = _context5.sent;

            t.is(res.status, 200);
            t.deepEqual(res.body, {
              success: true,
              status: 200,
              data: {
                key: 'foo',
                value: '1337'
              }
            });

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(request, 'request', 'src/server/controllers/config.test.js');
})();

;
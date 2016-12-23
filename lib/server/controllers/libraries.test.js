'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _models = require('../models');

var _supertestAsPromised = require('supertest-as-promised');

var _supertestAsPromised2 = _interopRequireDefault(_supertestAsPromised);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _server = require('../server.js');

var _server2 = _interopRequireDefault(_server);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _supertestAsPromised2.default)(_server2.default);
var delay = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ms) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (fulfill) {
              setTimeout(fulfill, ms);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function delay(_x) {
    return _ref.apply(this, arguments);
  };
}();
(0, _ava2.default)('POST /v1/libraries', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return request.post('/v1/libraries').send({
              name: 'Library #1',
              path: '/foo/bar'
            });

          case 2:
            res = _context2.sent;

            t.is(res.status, 201);

          case 4:
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
(0, _ava2.default)('POST /v1/libraries/:id/scans dryRun', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var res, id, scanRes;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return request.post('/v1/libraries').send({
              name: 'Library #2',
              path: '/foo/bar'
            });

          case 2:
            res = _context3.sent;


            t.is(res.status, 201);
            id = res.body.data._id;
            _context3.next = 7;
            return request.post('/v1/libraries/' + id + '/scans').send({ dryRun: true });

          case 7:
            scanRes = _context3.sent;

            t.is(scanRes.status, 201);
            t.is(scanRes.body.data.statusCode, 'PENDING');
            t.is(scanRes.body.data.dryRun, true);

            // let sId = scanRes.body.data._id;
            // await delay(500);
            //
            // scanRes = await request.get('/v1/libraries/' + id + '/scans/' + sId);
            // t.is(scanRes.status, 200);
            // t.is(scanRes.body.data.statusCode, 'STARTED');
            //
            // await delay(1337);
            //
            // scanRes = await request.get('/v1/libraries/' + id + '/scans/' + sId);
            // t.is(scanRes.status, 200);
            // t.is(scanRes.body.data.statusCode, 'DONE');

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
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(request, 'request', 'src/server/controllers/libraries.test.js');

  __REACT_HOT_LOADER__.register(delay, 'delay', 'src/server/controllers/libraries.test.js');
})();

;
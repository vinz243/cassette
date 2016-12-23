'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _models = require('../models');

var _supertestAsPromised = require('supertest-as-promised');

var _supertestAsPromised2 = _interopRequireDefault(_supertestAsPromised);

var _server = require('../server.js');

var _server2 = _interopRequireDefault(_server);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _supertestAsPromised2.default)(_server2.default);

(0, _ava2.default)('lists albums', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, album;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return request.get('/v1/albums');

          case 2:
            res = _context.sent;

            t.is(res.body.length, 0);
            t.is(res.body.data.length, 0);

            _context.next = 7;
            return new _models.Album({ name: 'Foo' }).create();

          case 7:
            _context.next = 9;
            return request.get('/v1/albums');

          case 9:
            res = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 13;
            _iterator = (0, _getIterator3.default)(res.body.data);

          case 15:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 22;
              break;
            }

            album = _step.value;

            if (!((album || {}).name === 'Foo')) {
              _context.next = 19;
              break;
            }

            return _context.abrupt('return');

          case 19:
            _iteratorNormalCompletion = true;
            _context.next = 15;
            break;

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context['catch'](13);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 28:
            _context.prev = 28;
            _context.prev = 29;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 31:
            _context.prev = 31;

            if (!_didIteratorError) {
              _context.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context.finish(31);

          case 35:
            return _context.finish(28);

          case 36:
            t.fail('created album not found');

          case 37:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[13, 24, 28, 36], [29,, 31, 35]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

(0, _ava2.default)('get one album', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var distantRelatives, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            distantRelatives = new _models.Album('Distant Relatives');
            _context2.next = 3;
            return distantRelatives.create();

          case 3:
            _context2.next = 5;
            return request.get('/v1/albums/' + distantRelatives._id);

          case 5:
            res = _context2.sent;

            t.is(res.body.data.name, 'Distant Relatives');

          case 7:
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

(0, _ava2.default)('search albums', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new _models.Album('TestA').create();

          case 2:
            _context3.next = 4;
            return new _models.Album('TestB').create();

          case 4:
            _context3.next = 6;
            return new _models.Album('TestC').create();

          case 6:
            _context3.next = 8;
            return new _models.Album('JesdD').create();

          case 8:
            _context3.next = 10;
            return request.post('/v1/albums/searches').send({
              name: '/test/'
            });

          case 10:
            res = _context3.sent;

            t.is(res.body.length, 3);

          case 12:
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

  __REACT_HOT_LOADER__.register(request, 'request', 'src/server/controllers/albums.test.js');
})();

;
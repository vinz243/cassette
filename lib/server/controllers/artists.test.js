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

(0, _ava2.default)('/v1/artists', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, artist;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return request.get('/v1/artists');

          case 2:
            res = _context.sent;

            t.is(res.body.length, 0);
            t.is(res.body.data.length, 0);

            _context.next = 7;
            return new _models.Artist({ name: 'Foo' }).create();

          case 7:
            _context.next = 9;
            return request.get('/v1/artists');

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

            artist = _step.value;

            if (!((artist || {}).name === 'Foo')) {
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
            t.fail('created artist not found');

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

(0, _ava2.default)('/v1/artists/:id', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var systemOfADown, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            systemOfADown = new _models.Artist('System Of A Dawn');

            systemOfADown.data.genre = 'Alt Metal';
            _context2.next = 4;
            return systemOfADown.create();

          case 4:
            _context2.next = 6;
            return request.get('/v1/artists/' + systemOfADown._id);

          case 6:
            res = _context2.sent;

            t.is(res.body.data.name, 'System Of A Dawn');
            t.is(res.body.data.genre, 'Alt Metal');

          case 9:
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

(0, _ava2.default)('/v1/artists/:id/searches', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new _models.Artist('TestA').create();

          case 2:
            _context3.next = 4;
            return new _models.Artist('TestB').create();

          case 4:
            _context3.next = 6;
            return new _models.Artist('TestC').create();

          case 6:
            _context3.next = 8;
            return new _models.Artist('JesdD').create();

          case 8:
            _context3.next = 10;
            return request.post('/v1/artists/searches').send({
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
(0, _ava2.default)('/v1/artists/:id/albums and tracks', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var alborosie, soulPirate, freedomFyah, coldplay, ghostStories, res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            alborosie = new _models.Artist({
              name: 'Alborosie',
              genre: 'Reggae'
            });
            _context4.next = 3;
            return alborosie.create();

          case 3:
            soulPirate = new _models.Album({
              name: 'Soul Pirate',
              artistId: alborosie._id
            });
            _context4.next = 6;
            return soulPirate.create();

          case 6:
            freedomFyah = new _models.Album({
              name: 'Freedom & Fyah',
              artistId: alborosie._id
            });
            _context4.next = 9;
            return freedomFyah.create();

          case 9:

            // Create another artist&album
            coldplay = new _models.Artist({
              name: 'Coldplay',
              genre: 'Commercialized Music'
            });
            _context4.next = 12;
            return coldplay.create();

          case 12:
            ghostStories = new _models.Album({
              name: 'Ghost Stories',
              artistId: coldplay._id
            });
            _context4.next = 15;
            return ghostStories.create();

          case 15:
            _context4.next = 17;
            return request.get('/v1/artists/' + alborosie._id + '/albums').expect(200);

          case 17:
            res = _context4.sent;

            t.is(res.body.length, 2);
            t.is(res.body.data.length, 2);

            t.not(res.body.data[0].name, undefined);
            t.not(res.body.data[1].name, undefined);

            t.is(res.body.data[0].artistId, alborosie._id);
            t.is(res.body.data[1].artistId, alborosie._id);

            _context4.next = 26;
            return new _models.Track({ name: 'Herbalist', artistId: alborosie._id }).create();

          case 26:
            _context4.next = 28;
            return request.get('/v1/artists/' + alborosie._id + '/tracks');

          case 28:
            res = _context4.sent;

            t.is(res.body.length, 1);
            t.is(res.body.data[0].name, 'Herbalist');

          case 31:
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
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(request, 'request', 'src/server/controllers/artists.test.js');
})();

;
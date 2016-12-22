'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('creates an Album object with correct props', function (t) {
  var soulPirate = new _index.Album('Soul Pirate');
  t.is(soulPirate.data.name, 'Soul Pirate');

  var freedomAndFyah = new _index.Album({
    name: 'Freedom & Fyah',
    year: 2016,
    artistId: 42
  });

  t.is(freedomAndFyah.data.name, 'Freedom & Fyah');
  t.is(freedomAndFyah.data.year, 2016);
  t.is(freedomAndFyah.data.artistId, 42);
});

(0, _ava2.default)('inserts an album to DB and fetch it', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var foo, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            foo = new _index.Album('foo');

            t.falsy(foo._id);
            _context.next = 4;
            return foo.create();

          case 4:
            t.not(foo._id, undefined);

            _context.next = 7;
            return _index.Album.findById(foo._id);

          case 7:
            res = _context.sent;


            t.is(res.data.name, 'foo');
            t.truthy(res instanceof _index.Album);

          case 10:
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

(0, _ava2.default)('find multiple docs', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var albumOne, albumTwo, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            albumOne = new _index.Album('Album One');

            albumOne.data.year = 1998;
            _context2.next = 4;
            return albumOne.create();

          case 4:
            albumTwo = new _index.Album('Album Two');

            albumTwo.data.year = 1998;
            _context2.next = 8;
            return albumTwo.create();

          case 8:
            _context2.next = 10;
            return _index.Album.find({ year: 1998 });

          case 10:
            res = _context2.sent;

            t.is(res.length, 2);

          case 12:
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

(0, _ava2.default)('won\'t create multiple time', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var bar;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            bar = new _index.Album('bar');

            bar.data.year = 1337;
            _context3.next = 4;
            return bar.create();

          case 4:
            t.throws(bar.create());

          case 5:
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

(0, _ava2.default)('won\'t create fetched album', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var another, a;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            another = new _index.Album('Another Album');
            _context4.next = 3;
            return another.create();

          case 3:
            _context4.next = 5;
            return _index.Album.findById(another._id);

          case 5:
            a = _context4.sent;

            t.throws(a.create());

          case 7:
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
//
// test('won\'t query nothing', async t => {
//   t.throws(Album.find({}));
//   t.throws(Album.find({foo: 'bar'}));
// })

;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
})();

;
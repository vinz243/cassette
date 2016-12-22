'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('creates an Track object with correct props', function (t) {
  var herbalist = new _index.Track('Herbalist');
  t.is(herbalist.data.name, 'Herbalist');

  var kingstonTown = new _index.Track({
    name: 'Kingston Town',
    duration: '13:37',
    artistId: '42',
    albumId: '1337'
  });

  t.is(kingstonTown.data.name, 'Kingston Town');
  t.is(kingstonTown.data.duration, '13:37');
  t.is(kingstonTown.data.artistId, '42');
  t.is(kingstonTown.data.albumId, '1337');
});

(0, _ava2.default)('inserts an album to DB and fetch it', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var foo, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            foo = new _index.Track('foo');

            t.falsy(foo._id);
            _context.next = 4;
            return foo.create();

          case 4:
            t.not(foo._id, undefined);

            _context.next = 7;
            return _index.Track.findById(foo._id);

          case 7:
            res = _context.sent;


            t.is(res.data.name, 'foo');
            t.truthy(res instanceof _index.Track);

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
    var trackOne, trackTwo, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            trackOne = new _index.Track('Track One');

            trackOne.data.albumId = '42';
            _context2.next = 4;
            return trackOne.create();

          case 4:
            trackTwo = new _index.Track('Track Two');

            trackTwo.data.albumId = '42';
            _context2.next = 8;
            return trackTwo.create();

          case 8:
            _context2.next = 10;
            return _index.Track.find({ albumId: '42' });

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
            bar = new _index.Track('bar');
            _context3.next = 3;
            return bar.create();

          case 3:
            t.throws(bar.create());

          case 4:
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

(0, _ava2.default)('won\'t create fetched track', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var another, a;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            another = new _index.Track('Another Track');
            _context4.next = 3;
            return another.create();

          case 3:
            _context4.next = 5;
            return _index.Track.findById(another._id);

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

// test('won\'t query nothing', async t => {
//   t.throws(Track.find({}));
//   t.throws(Track.find({foo: 'bar'}));
// })

;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
})();

;
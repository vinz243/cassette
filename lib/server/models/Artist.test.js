'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('creates a new Artist object with correct props', function (t) {
  var artist = new _index.Artist('Alborosie');
  t.is(artist.data.name, 'Alborosie');
});

(0, _ava2.default)('accepts db object', function (t) {
  var artist = new _index.Artist({
    _id: '42',
    name: 'Alborosie',
    genre: 'Reggae'
  });
  t.is(artist._id, '42');
  t.is(artist.data.name, 'Alborosie');
  t.is(artist.data.genre, 'Reggae');
});

(0, _ava2.default)('creates a new Artist and save it to db', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var artist;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            artist = new _index.Artist('Alborosie');

            artist.data.genre = 'Reggae';

            _context.next = 4;
            return artist.create();

          case 4:
            t.not(artist._id, undefined);

          case 5:
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

(0, _ava2.default)('creates an artist and fetch it by id', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var eminem, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            eminem = new _index.Artist('Eminem');

            eminem.data.genre = 'Rap';

            _context2.next = 4;
            return eminem.create();

          case 4:
            _context2.next = 6;
            return _index.Artist.findById(eminem._id);

          case 6:
            res = _context2.sent;


            t.is(res.data.name, 'Eminem');
            t.is(res.data.genre, 'Rap');

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

(0, _ava2.default)('creates an artist and fetch it by name', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var bustaRhymes, res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            bustaRhymes = new _index.Artist('Busta Rhymes');

            bustaRhymes.data.genre = 'Rap';

            _context3.next = 4;
            return bustaRhymes.create();

          case 4:
            _context3.next = 6;
            return _index.Artist.find({ name: 'Busta Rhymes' });

          case 6:
            res = _context3.sent;


            t.is(res[0].data.name, 'Busta Rhymes');
            t.is(res[0].data.genre, 'Rap');
            t.is(res.length, 1);

          case 10:
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

(0, _ava2.default)('can fetch several artists', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var foo, bar, res;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            foo = new _index.Artist('Foo'), bar = new _index.Artist('Bar');

            foo.data.genre = bar.data.genre = 'Foobar';

            _context4.next = 4;
            return foo.create();

          case 4:
            _context4.next = 6;
            return bar.create();

          case 6:
            _context4.next = 8;
            return _index.Artist.find({ genre: 'Foobar' });

          case 8:
            res = _context4.sent;


            t.is(res.length, 2);
            if (res[0]._id === foo._id) {
              t.is(res[0].data.name, 'Foo');
              t.is(res[1].data.name, 'Bar');
            } else {
              t.is(res[1].data.name, 'Foo');
              t.is(res[0].data.name, 'Bar');
            }

          case 11:
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

// test('refuses empty queries', async t => {
//
//   t.throws(Artist.find({}));
//   t.throws(Artist.find({foo: 'bar'}));
// });

(0, _ava2.default)('refuses to create fetched artist', function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(t) {
    var foo;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            foo = new _index.Artist({
              name: 'test',
              genre: 'test',
              _id: '1337'
            });


            t.throws(foo.create());

          case 2:
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

(0, _ava2.default)('refuses to create twice', function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(t) {
    var davodka;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            davodka = new _index.Artist('Davodka');
            _context6.next = 3;
            return davodka.create();

          case 3:

            t.throws(davodka.create());

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());

// test('refuses dup artists', async t => {
//   let hugoTsr = new Artist('Hugo TSR');
//   await hugoTsr.create();
//
//   t.throws( (new Artist('Hugo TSR')).create());
// });

;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
})();

;
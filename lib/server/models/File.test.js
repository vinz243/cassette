'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('creates an object with expected props and no more', function (t) {
  var data = {
    _id: 'id of file',
    path: 'abs path to file',
    format: 'format',
    bitrate: 320,
    lossless: true,
    size: 'file size in bytes',
    duration: 1337,
    trackId: 'track id',
    albumId: 'album id',
    artistId: 'artist id'
  };

  var track = new _index.File(data);
  // console.log(track);
  for (var key in data) {
    // console.log(key);
    t.is(track.data[key], data[key]);
  }
});

(0, _ava2.default)('creates object and insert it to db', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(t) {
    var file;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = new _index.File({
              path: '/home/Music/track01.flac',
              lossless: true
            });
            _context.next = 3;
            return file.create();

          case 3:
            t.not(file.data._id, undefined);

          case 4:
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

(0, _ava2.default)('creates an object, insert it and fetch it by _id', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var file, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            file = new _index.File({
              path: '/foo/bar',
              bitrate: 320
            });
            _context2.next = 3;
            return file.create();

          case 3:
            t.not(file._id, undefined);

            _context2.next = 6;
            return _index.File.findById(file._id);

          case 6:
            res = _context2.sent;

            t.is(res.data.path, '/foo/bar');
            t.is(res.data.bitrate, 320);

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

(0, _ava2.default)('creates an object and fetch it by path', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var file, res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            file = new _index.File({
              path: '/bar/foo',
              bitrate: 192
            });
            _context3.next = 3;
            return file.create();

          case 3:

            t.not(file._id, undefined);

            _context3.next = 6;
            return _index.File.find({ path: '/bar/foo' });

          case 6:
            res = _context3.sent[0];

            t.is(res._id, file._id);

          case 8:
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

// test('creates two different files for track and f')

// test('', t => {
// })

;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
})();

;
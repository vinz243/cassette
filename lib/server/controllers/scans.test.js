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

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _server = require('../server.js');

var _server2 = _interopRequireDefault(_server);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _supertestAsPromised2.default)(_server2.default);

var libraryId = undefined,
    scanId = undefined;

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
var dir = _path2.default.resolve('../../../data/library');

_ava2.default.serial('create library', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(t) {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return request.post('/v1/libraries').send({
              name: 'test-library',
              path: dir
            });

          case 2:
            res = _context2.sent;


            t.is(res.status, 201);

            libraryId = res.body.data._id;
            t.not(libraryId, undefined);

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

_ava2.default.serial('trigger scan', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(t) {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            (0, _assert2.default)(libraryId !== undefined);

            _context3.next = 3;
            return request.post('/v1/libraries/' + libraryId + '/scans').send({ dryRun: false });

          case 3:
            res = _context3.sent;


            t.is(res.status, 201);

            scanId = res.body.data._id;
            t.not(scanId, undefined);

          case 7:
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

_ava2.default.serial('check result', function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(t) {
    var res, MAX_RETRY, retries;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            (0, _assert2.default)(libraryId !== undefined);
            (0, _assert2.default)(scanId !== undefined);

            _context4.next = 4;
            return delay(250);

          case 4:
            _context4.next = 6;
            return request.get('/v1/libraries/' + libraryId + '/scans/' + scanId);

          case 6:
            res = _context4.sent;
            MAX_RETRY = 40;
            retries = 1;

          case 9:
            if (!(res.body.data.statusCode === "PENDING")) {
              _context4.next = 20;
              break;
            }

            _context4.next = 12;
            return delay(250);

          case 12:
            _context4.next = 14;
            return request.get('/v1/libraries/' + libraryId + '/scans/' + scanId);

          case 14:
            res = _context4.sent;

            retries = retries + 1;

            if (!(retries > MAX_RETRY)) {
              _context4.next = 18;
              break;
            }

            throw new Error('Max retries exceeded');

          case 18:
            _context4.next = 9;
            break;

          case 20:
            t.is(res.body.data.statusCode, 'DONE');

          case 21:
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
var albumId = '';
_ava2.default.serial('list albums', function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(t) {
    var res;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            (0, _assert2.default)(libraryId !== undefined);
            (0, _assert2.default)(scanId !== undefined);

            _context5.next = 4;
            return request.get('/v1/albums');

          case 4:
            res = _context5.sent;


            // console.log(res.body);

            t.truthy(res.body.data[0].name === 'Night Visions' || res.body.data[0].name === 'The Eminem Show');
            t.truthy(res.body.data[1].name === 'Night Visions' || res.body.data[1].name === 'The Eminem Show');

            if (res.body.data[0].name === 'Night Visions') {
              t.is(res.body.data[1].name, 'The Eminem Show');
              albumId = res.body.data[0].albumId;
            } else {
              t.is(res.body.data[1].name, 'Night Visions');
              albumId = res.body.data[1].albumId;
            }

          case 8:
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

var file = {};

_ava2.default.serial('list files', function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(t) {
    var res;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return request.get('/v1/files?path=' + dir + '/Radioactive.flac');

          case 2:
            res = _context6.sent;

            t.is(res.status, 200);

            file = res.body.data[0];
            t.is(res.body.length, 1);
            t.is(file.path, dir + '/Radioactive.flac');

          case 7:
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

_ava2.default.serial('see commercialized "artist"', function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(t) {
    var res, artist;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return request.get('/v1/artists/' + file.artistId);

          case 2:
            res = _context7.sent;
            artist = res.body.data;

            t.is(artist.name, 'Imagine Dragons');

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());

_ava2.default.serial('see commercialized track > /v1/tracks', function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(t) {
    var res, track;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return request.get('/v1/tracks/' + file.trackId);

          case 2:
            res = _context8.sent;
            track = res.body.data;

            t.is(track.name, 'Radioactive');

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());

_ava2.default.serial('see commercialized track > /v1/artists/id/tracks', function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(t) {
    var res, track;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return request.get('/v1/artists/' + file.artistId + '/tracks');

          case 2:
            res = _context9.sent;
            track = res.body.data[0];

            t.is(track.name, 'Radioactive');

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}());
_ava2.default.serial('see commercialized file > /v1/tracks/id/files', function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(t) {
    var res, f;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return request.get('/v1/tracks/' + file.trackId + '/files');

          case 2:
            res = _context10.sent;
            f = res.body.data[0];
            // t.is(f.bitrate, 214391);

            t.is(f.path, file.path);

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function (_x10) {
    return _ref10.apply(this, arguments);
  };
}());
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(request, 'request', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(libraryId, 'libraryId', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(scanId, 'scanId', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(delay, 'delay', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(dir, 'dir', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(albumId, 'albumId', 'src/server/controllers/scans.test.js');

  __REACT_HOT_LOADER__.register(file, 'file', 'src/server/controllers/scans.test.js');
})();

;
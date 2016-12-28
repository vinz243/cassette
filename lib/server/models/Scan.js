'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processResult = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _Library = require('./Library');

var _Library2 = _interopRequireDefault(_Library);

var _Album = require('./Album');

var _Album2 = _interopRequireDefault(_Album);

var _Artist = require('./Artist');

var _Artist2 = _interopRequireDefault(_Artist);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _File = require('./File');

var _File2 = _interopRequireDefault(_File);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var processResult = exports.processResult = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(res) {
    var data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, artistName, artist, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, albumName, album, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, t, track, file;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(res.status === 'done')) {
              _context.next = 102;
              break;
            }

            data = res.data;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 5;
            _iterator = Object.keys(data)[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 88;
              break;
            }

            artistName = _step.value;
            _context.next = 11;
            return _Artist2.default.find({ name: artistName });

          case 11:
            artist = _context.sent[0];

            if (artist) {
              _context.next = 16;
              break;
            }

            artist = new _Artist2.default(artistName);
            _context.next = 16;
            return artist.create();

          case 16:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 19;
            _iterator2 = Object.keys(data[artistName])[Symbol.iterator]();

          case 21:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 71;
              break;
            }

            albumName = _step2.value;
            _context.next = 25;
            return _Album2.default.find({ name: albumName });

          case 25:
            album = _context.sent[0];

            if (album) {
              _context.next = 31;
              break;
            }

            album = new _Album2.default(albumName);
            album.data.artistId = artist.data._id;
            _context.next = 31;
            return album.create();

          case 31:
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 34;
            _iterator3 = data[artistName][albumName][Symbol.iterator]();

          case 36:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 54;
              break;
            }

            t = _step3.value;
            _context.next = 40;
            return _Track2.default.find({ name: t.trackTitle });

          case 40:
            track = _context.sent[0];

            if (track) {
              _context.next = 48;
              break;
            }

            track = new _Track2.default(t.trackTitle);
            track.data.artistId = artist.data._id;
            track.data.albumId = album.data._id;
            track.data.duration = t.duration;
            _context.next = 48;
            return track.create();

          case 48:
            file = new _File2.default({
              path: t.path,
              duration: t.duration, // TODO: Bitrate and everything
              bitrate: t.bitrate,
              artistId: artist.data._id,
              albumId: album.data._id,
              trackId: track.data._id
            });
            _context.next = 51;
            return file.create();

          case 51:
            _iteratorNormalCompletion3 = true;
            _context.next = 36;
            break;

          case 54:
            _context.next = 60;
            break;

          case 56:
            _context.prev = 56;
            _context.t0 = _context['catch'](34);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 60:
            _context.prev = 60;
            _context.prev = 61;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 63:
            _context.prev = 63;

            if (!_didIteratorError3) {
              _context.next = 66;
              break;
            }

            throw _iteratorError3;

          case 66:
            return _context.finish(63);

          case 67:
            return _context.finish(60);

          case 68:
            _iteratorNormalCompletion2 = true;
            _context.next = 21;
            break;

          case 71:
            _context.next = 77;
            break;

          case 73:
            _context.prev = 73;
            _context.t1 = _context['catch'](19);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 77:
            _context.prev = 77;
            _context.prev = 78;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 80:
            _context.prev = 80;

            if (!_didIteratorError2) {
              _context.next = 83;
              break;
            }

            throw _iteratorError2;

          case 83:
            return _context.finish(80);

          case 84:
            return _context.finish(77);

          case 85:
            _iteratorNormalCompletion = true;
            _context.next = 7;
            break;

          case 88:
            _context.next = 94;
            break;

          case 90:
            _context.prev = 90;
            _context.t2 = _context['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 94:
            _context.prev = 94;
            _context.prev = 95;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 97:
            _context.prev = 97;

            if (!_didIteratorError) {
              _context.next = 100;
              break;
            }

            throw _iteratorError;

          case 100:
            return _context.finish(97);

          case 101:
            return _context.finish(94);

          case 102:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 90, 94, 102], [19, 73, 77, 85], [34, 56, 60, 68], [61,, 63, 67], [78,, 80, 84], [95,, 97, 101]]);
  }));

  return function processResult(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Scan = new _Model2.default('scan').field('startDate').int().done().field('dryRun').defaultValue(false).boolean().done().field('libraryId').string().required().defaultParam().done().field('statusMessage').string().done().field('statusCode').string().done().implement('startScan', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
  var _this = this;

  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // console.log('start');
          this.data.statusCode = 'STARTED';
          this.data.statusMessage = 'Scan started...';

          _process2.default.nextTick(function () {
            if (_this.data.dryRun) {
              _this.data.statusCode = 'DONE';
              _this.data.statusMessage = 'Scan was a dry run';
            } else {
              _Library2.default.findById(_this.data.libraryId).then(function (dir) {
                var child = _child_process2.default.fork(require.resolve('../scripts/music_scanner'));

                child.send({
                  action: 'set_config',
                  data: {
                    dir: dir.data.path
                  }
                });

                child.send({ action: 'execute' });

                child.on('message', function (res) {
                  if (res.status === 'LOG') {
                    console.log('child: ' + res.msg);
                    return;
                  }
                  processResult(res).then(function () {
                    _this.data.statusCode = 'DONE';
                    _this.data.statusMessage = 'Scan finished without errors';
                    _this.update();
                  }).catch(function (err) {
                    _this.data.statusCode = 'FAILED';
                    _this.data.statusMessage = err;
                  });
                });
              });
            }
          });

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}))).done();
exports.default = Scan;
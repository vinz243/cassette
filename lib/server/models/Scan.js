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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _storyboard = require('storyboard');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var processResult = exports.processResult = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(res) {
    var data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, artistName, artist, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, albumName, album, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, t, track, dup, file;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(res.status === 'done')) {
              _context.next = 107;
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
              _context.next = 93;
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
              _context.next = 76;
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
              _context.next = 59;
              break;
            }

            t = _step3.value;
            _context.next = 40;
            return _Track2.default.find({ name: t.trackTitle });

          case 40:
            track = _context.sent[0];

            if (track) {
              _context.next = 49;
              break;
            }

            track = new _Track2.default(t.trackTitle);
            track.data.artistId = artist.data._id;
            track.data.albumId = album.data._id;
            track.data.duration = t.duration;
            // console.log("ADDING TRACK", t.trackNumber);
            if (t.trackNumber) {
              track.data.trackNumber = (t.trackNumber + '').match(/^\d+/)[0] - 0;
            }
            _context.next = 49;
            return track.create();

          case 49:
            _context.next = 51;
            return _File2.default.find({ path: t.path });

          case 51:
            dup = _context.sent;

            if (!(dup.length === 0)) {
              _context.next = 56;
              break;
            }

            file = new _File2.default({
              path: t.path,
              duration: t.duration, // TODO: Bitrate and everything
              bitrate: t.bitrate,
              artistId: artist.data._id,
              albumId: album.data._id,
              trackId: track.data._id
            });
            _context.next = 56;
            return file.create();

          case 56:
            _iteratorNormalCompletion3 = true;
            _context.next = 36;
            break;

          case 59:
            _context.next = 65;
            break;

          case 61:
            _context.prev = 61;
            _context.t0 = _context['catch'](34);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 65:
            _context.prev = 65;
            _context.prev = 66;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 68:
            _context.prev = 68;

            if (!_didIteratorError3) {
              _context.next = 71;
              break;
            }

            throw _iteratorError3;

          case 71:
            return _context.finish(68);

          case 72:
            return _context.finish(65);

          case 73:
            _iteratorNormalCompletion2 = true;
            _context.next = 21;
            break;

          case 76:
            _context.next = 82;
            break;

          case 78:
            _context.prev = 78;
            _context.t1 = _context['catch'](19);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 82:
            _context.prev = 82;
            _context.prev = 83;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 85:
            _context.prev = 85;

            if (!_didIteratorError2) {
              _context.next = 88;
              break;
            }

            throw _iteratorError2;

          case 88:
            return _context.finish(85);

          case 89:
            return _context.finish(82);

          case 90:
            _iteratorNormalCompletion = true;
            _context.next = 7;
            break;

          case 93:
            _context.next = 99;
            break;

          case 95:
            _context.prev = 95;
            _context.t2 = _context['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 99:
            _context.prev = 99;
            _context.prev = 100;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 102:
            _context.prev = 102;

            if (!_didIteratorError) {
              _context.next = 105;
              break;
            }

            throw _iteratorError;

          case 105:
            return _context.finish(102);

          case 106:
            return _context.finish(99);

          case 107:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 95, 99, 107], [19, 78, 82, 90], [34, 61, 65, 73], [66,, 68, 72], [83,, 85, 89], [100,, 102, 106]]);
  }));

  return function processResult(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Scan = new _Model2.default('scan').field('startDate').int().done().field('dryRun').defaultValue(false).boolean().done().field('libraryId').string().required().defaultParam().done().field('statusMessage').string().done().field('statusCode').string().done().implement('startScan', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
  var _this = this;

  var story;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // console.log('start');
          this.data.statusCode = 'STARTED';
          this.data.statusMessage = 'Scan started...';
          story = _storyboard.mainStory.child({
            src: 'libscan',
            title: 'Library scan',
            level: 'info'
          });

          story.debug('Running scan on `nextTick()`');
          _process2.default.nextTick(function () {
            if (_this.data.dryRun) {
              _this.data.statusCode = 'DONE';
              _this.data.statusMessage = 'Scan was a dry run';
              story.warn(_chalk2.default.bold('dryRun') + ' flag was set');
              story.close();
            } else {
              _Library2.default.findById(_this.data.libraryId).then(function (dir) {
                var child = _child_process2.default.fork(require.resolve('../scripts/music_scanner'));
                story.debug('Child process forked');

                story.debug(_chalk2.default.dim('Executing action ') + ' \'set_config\'', {
                  dir: dir.data.path
                });

                child.send({
                  action: 'set_config',
                  data: {
                    dir: dir.data.path
                  }
                });
                story.debug(_chalk2.default.dim('Executing action ') + ' \'execute\'');
                child.send({ action: 'execute' });

                child.on('message', function (res) {
                  if (res.status === 'LOG') {
                    story.info(res.msg);
                    return;
                  }
                  processResult(res).then(function () {
                    _this.data.statusCode = 'DONE';
                    _this.data.statusMessage = 'Scan finished without errors';
                    _this.update();
                    story.info('Scan finished !');
                    story.close();
                  }).catch(function (err) {
                    _this.data.statusCode = 'FAILED';
                    _this.data.statusMessage = err;
                    story.error('Scan errored', err);
                    story.close();
                  });
                });
              });
            }
          });

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}))).done();
exports.default = Scan;
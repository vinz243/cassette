'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = exports.operationMapperFactory = exports.normalizeArtist = exports.titleCase = exports.getMediastic = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tree = require('./tree');

var _Library = require('../../models/Library');

var _Artist = require('../../models/Artist');

var _Album = require('../../models/Album');

var _Track = require('../../models/Track');

var _File = require('../../models/File');

var _fsTreeDiff = require('fs-tree-diff');

var _fsTreeDiff2 = _interopRequireDefault(_fsTreeDiff);

var _mediastic = require('mediastic');

var _mediastic2 = _interopRequireDefault(_mediastic);

var _storyboard = require('storyboard');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getMediastic = exports.getMediastic = function getMediastic() {
  var mediastic = new _mediastic2.default();

  mediastic.use(function (metadata, next) {
    _storyboard.mainStory.info('scanner', 'Working on ' + metadata.path);
    next();
  });

  mediastic.use(_mediastic2.default.tagParser());
  mediastic.use(_mediastic2.default.fileNameParser());

  return mediastic;
};

var titleCase = exports.titleCase = function titleCase() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unknown';

  if (/^((([A-Z]{2,}\b).?){2,}|([a-z]+\b.?\s?)+)$/.test(str)) {
    return str.toLowerCase().split(/(\.\s?|\s)/g).filter(function (w) {
      return !/^\s*$/.test(w);
    }).map(function (w) {
      return w[0].toUpperCase(0) + w.slice(1);
    }).join(' ');
  }
  return str;
};

var normalizeArtist = exports.normalizeArtist = function normalizeArtist() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unknown';

  return titleCase(str.replace(/feat.+$/g, '').trim());
};

var operationMapper = function operationMapper(models, mediastic, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      operation = _ref2[0],
      fileName = _ref2[1],
      entry = _ref2[2];

  var filePath = _path2.default.join(entry.basePath, entry.relativePath);
  switch (operation) {
    case 'change':
      return operationMapper(models, mediastic, ['unlink', fileName, entry]).then(function () {
        return operationMapper(models, mediastic, ['create', fileName, entry]);
      });
    case 'create':
      return mediastic(filePath).then(function (metadata) {
        if (!metadata.duration) return Promise.reject(new Error('Corrupted file on \'' + filePath + '\''));
        return models.findOrCreateArtist({
          name: normalizeArtist(metadata.artist)
        }).then(function (artist) {
          return Promise.resolve([metadata, artist]);
        });
      }).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            metadata = _ref4[0],
            artist = _ref4[1];

        return models.findOrCreateAlbum({
          name: titleCase(metadata.album)
        }, {
          artist: artist.props._id
        }).then(function (album) {
          return Promise.resolve([metadata, artist, album]);
        });
      }).then(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 3),
            metadata = _ref6[0],
            artist = _ref6[1],
            album = _ref6[2];

        return models.findOrCreateTrack({
          name: titleCase(metadata.title),
          album: album.props._id,
          trackNumber: ((metadata.track + '').match(/^\d+/) || [0])[0] - 0
        }, {
          artist: artist.props._id,
          duration: metadata.duration
        }).then(function (track) {
          return Promise.resolve([metadata, artist, album, track]);
        });
      }).then(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 4),
            metadata = _ref8[0],
            artist = _ref8[1],
            album = _ref8[2],
            track = _ref8[3];

        var file = models.File({
          duration: metadata.duration,
          bitrate: metadata.bitrate,
          path: filePath,
          artist: artist.props._id,
          album: album.props._id,
          track: track.props._id
        });
        return file.create().then(function () {
          return Promise.resolve([metadata, artist, album, track, file]);
        });
      }).then(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 5),
            metadata = _ref10[0],
            artist = _ref10[1],
            album = _ref10[2],
            track = _ref10[3],
            file = _ref10[4];

        return models.findFileById(file.props._id);
      }).then(function (file) {
        _storyboard.mainStory.info('scanner', 'Done working on ' + filePath);
        _storyboard.mainStory.trace('scanner', 'Added a new track', { attach: file.props });
      }).catch(function (err) {
        _storyboard.mainStory.warn('scanner', err.message);
        _storyboard.mainStory.trace('scanner', 'Library scan encountered an error', { attach: err });
      });
    case 'unlink':
      return (0, _File.findOne)({ path: filePath }).then(function (file) {
        return file.remove();
      });
    case 'mkdir':
    case 'rmdir':
      return Promise.resolve();
  }
};

var operationMapperFactory = exports.operationMapperFactory = function operationMapperFactory(models, mediastic) {
  return operationMapper.bind(null, models, mediastic);
};

var scan = exports.scan = function () {
  var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(libraryId) {
    var mediastic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getMediastic();
    var library, cachedEntries, cached, currentEntries, current, diff, mapper;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _Library.findById)(libraryId);

          case 2:
            library = _context.sent;
            _context.next = 5;
            return (0, _tree.getCachedEntries)(libraryId);

          case 5:
            cachedEntries = _context.sent;
            cached = new _fsTreeDiff2.default({
              entries: cachedEntries.map(function (entry) {
                return Object.assign({}, entry, {

                  isDirectory: function isDirectory() {
                    return entry.dir || false;
                  }
                });
              })
            });
            currentEntries = (0, _tree.getFolderEntries)(library.props.path);
            current = new _fsTreeDiff2.default({
              entries: currentEntries
            });

            _storyboard.mainStory.info('scanner', 'Loaded', { attach: { cached: cached, current: current } });
            diff = cached.calculatePatch(current);

            if (diff.length) {
              _context.next = 14;
              break;
            }

            _storyboard.mainStory.info('scanner', 'Library wasn\'t changed since last scan');
            return _context.abrupt('return');

          case 14:
            mapper = operationMapperFactory({
              findOrCreateTrack: _Track.findOrCreate, findOrCreateAlbum: _Album.findOrCreate, findOrCreateArtist: _Artist.findOrCreate, File: _File.File, findFileById: _File.findById
            }, mediastic.call.bind(mediastic));
            _context.next = 17;
            return diff.reduce(function (stack, entry) {
              return stack.then(mapper.bind(null, entry));
            }, Promise.resolve());

          case 17:
            return _context.abrupt('return', (0, _tree.writeCachedEntries)(libraryId, currentEntries.map(function (entry) {
              return Object.assign({}, entry, { dir: entry.isDirectory() });
            })));

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function scan(_x3) {
    return _ref11.apply(this, arguments);
  };
}();
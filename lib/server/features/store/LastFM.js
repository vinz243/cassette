'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _database = require('./database');

var _sizes = require('../artworks/sizes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LastFM = function () {
  function LastFM() {
    var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '85d5b036c6aa02af4d7216af592e1eea';

    _classCallCheck(this, LastFM);

    this._apiKey = apiKey;
  }

  _createClass(LastFM, [{
    key: 'search',
    value: function search(type, query) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
      var page = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;


      var url = 'https://ws.audioscrobbler.com/2.0/?method=' + type + '.search&' + type + '=' + encodeURIComponent(query) + '&api_key=' + this._apiKey + '&format=json&limit=' + limit;

      return new Promise(function (resolve, reject) {
        _request2.default.get(url, function (error, response, body) {
          if (error) return reject(error);
          resolve(JSON.parse(body));
        });
      });
    }
  }, {
    key: 'searchAlbum',
    value: function searchAlbum(query) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
      var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      return this.search('album', query, limit, page);
    }
  }, {
    key: 'searchArtist',
    value: function searchArtist(query) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
      var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      return this.search('artist', query, limit, page);
    }
  }, {
    key: 'searchTrack',
    value: function searchTrack(query) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
      var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      return this.search('track', query, limit, page);
    }
  }], [{
    key: 'parseResult',
    value: function parseResult(body) {
      return new Promise(function (resolve, reject) {
        var result = body.results;
        if (result.trackmatches) {
          return resolve(result.trackmatches.track.map(function (t) {
            return {
              id: 'lastfm:mbid:' + t.mbid,
              type: 'track',
              track: t.name,
              artist: t.artist
            };
          }));
        }
        if (result.albummatches) {
          return resolve(result.albummatches.album.map(function (a) {
            var size = 174;
            var availableSizes = a.image.map(function (s) {
              return s.size;
            });
            var target = (0, _sizes.getClosestSize)(size, availableSizes);
            var imageUrl = a.image.find(function (el) {
              return el.size === target;
            })['#text'] || 'http://lorempixel.com/g/' + size + '/' + size;
            return {
              id: (0, _database.push)(a),
              mbid: a.mbid,
              type: 'album',
              album: a.name,
              artist: a.artist,
              art: imageUrl
            };
          }));
        }
        // return resolve({
        //   type: mp
        //   artist_name,
        //   album_name,
        //   track_name,
        //   album_art
        // })
      });
    }
  }]);

  return LastFM;
}();

exports.default = LastFM;
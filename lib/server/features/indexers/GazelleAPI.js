'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _Release = require('./Release');

var _Release2 = _interopRequireDefault(_Release);

var _database = require('../store/database');

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _storyboard = require('storyboard');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GazelleAPI = function () {
  function GazelleAPI(config) {
    _classCallCheck(this, GazelleAPI);

    this.defaultConfig = {
      hostname: 'passtheheadphones.me',
      protocol: 'https',
      port: 443,
      endpoint: 'ajax.php',
      username: '',
      password: '',
      rateLimitMaxCalls: 5,
      rateLimitTimeFrame: 10000
    };

    this._config = Object.assign({}, this.defaultConfig, config);
    this._calls = [];
    this._request = _request2.default.defaults({
      jar: _request2.default.jar()
    });
    this._loggedIn = false;
  }

  _createClass(GazelleAPI, [{
    key: 'call',
    value: function call(method, args) {
      var _this = this;

      var endpoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._config.endpoint;
      var ropts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (!this._loggedIn) throw new Error('Not logged in');

      return new Promise(function (resolve, reject) {
        var delay = (0, _utils.nextCallDelay)(_this._calls, _this._config.rateLimitMaxCalls, _this._config.rateLimitTimeFrame);
        if (delay > 0) _storyboard.mainStory.info('indexers', 'delaying request of ' + delay + 'ms to avoid reaching rate');

        setTimeout(function () {
          _this._calls.push(Date.now());

          var query = Object.assign({}, {
            action: method
          }, args);
          var qs = _querystring2.default.stringify(query);
          var _config = _this._config,
              protocol = _config.protocol,
              hostname = _config.hostname,
              port = _config.port;

          var url = protocol + '://' + hostname + ':' + port + '/' + endpoint + '?' + qs;

          var time = Date.now();
          _this._request.get(Object.assign({}, { url: url }, ropts), function (err, res, data) {
            if (err) return reject(err);
            _storyboard.mainStory.info('indexers', 'request ' + _chalk2.default.dim(url) + ' ' + (Date.now() - time) + 'ms');
            try {
              var json = Object.assign({}, JSON.parse(data));
              resolve(json);
            } catch (err) {
              resolve(data);
            }
          });
        }, delay);
      });
    }
  }, {
    key: 'searchTorrents',
    value: function searchTorrents() {
      var q = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.call('browse', { searchstr: q }).then(GazelleAPI.parseTorrents);
    }
  }, {
    key: 'getRawTorrent',
    value: function getRawTorrent(id) {
      return this.call('download', { id: id }, 'torrents.php', { encoding: null });
      // if(!this._loggedIn) throw new Error('Not logged in');
      // this._request.get(url, (err, res, data) => {
      //   let qs = querystring.stringify();
      //   let url = `${protocol}://${hostname}:${port}/torrents.php?${qs}`;
      //
      // });
    }
  }, {
    key: 'login',
    value: function login() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2._loggedIn) {
          resolve();
        } else {
          (function () {
            var _config2 = _this2._config,
                protocol = _config2.protocol,
                hostname = _config2.hostname,
                port = _config2.port,
                endpoint = _config2.endpoint,
                username = _config2.username,
                password = _config2.password;

            _storyboard.mainStory.info('indexers', 'Trying to logging you in as ' + username + '...');
            var url = protocol + '://' + hostname + ':' + port + '/login.php';
            _this2._request.post({
              uri: url,
              form: {
                username: username, password: password,
                keeplogged: 1
              }
            }, function (err, res, data) {
              if (err) return reject(err);
              if (res.statusCode >= 400) return reject(new Error(res.statusCode));
              _this2._loggedIn = true;
              _storyboard.mainStory.info('indexers', 'Logged in as ' + username);
              resolve();
            });
          })();
        }
      });
    }
  }], [{
    key: 'parseTorrents',
    value: function parseTorrents(res) {
      if (!res || !res.response) {
        _storyboard.mainStory.warn('indexers', 'search failed', { attach: res });
        return [];
      }
      _storyboard.mainStory.info('indexers', 'yielded ' + res.response.results.length + ' results');
      return Promise.resolve((0, _utils.expandArray)(res.response.results, 'torrents', false).map(GazelleAPI.toRelease));
    }
  }, {
    key: 'toRelease',
    value: function toRelease(_ref) {
      var groupName = _ref.groupName,
          encoding = _ref.encoding,
          isFreeleech = _ref.isFreeleech,
          format = _ref.format,
          hasLog = _ref.hasLog,
          torrentId = _ref.torrentId,
          artist = _ref.artist,
          seeders = _ref.seeders,
          groupYear = _ref.groupYear;

      var id = _shortid2.default.generate();
      var release = new _Release2.default({
        _id: id,
        album: groupName,
        lossless: encoding === 'Lossless',
        freeleech: isFreeleech,
        year: groupYear,
        format: format,
        encoding: encoding,
        hasLog: hasLog,
        torrentId: torrentId,
        artist: artist,
        seeders: seeders
      });
      (0, _database.push)(id, release);
      return release;
    }
  }]);

  return GazelleAPI;
}();

exports.default = GazelleAPI;
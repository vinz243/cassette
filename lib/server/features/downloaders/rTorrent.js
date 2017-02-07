'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _scgi = require('./scgi');

var _scgi2 = _interopRequireDefault(_scgi);

var _storyboard = require('storyboard');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// var detectCharacterEncoding = require('detect-character-encoding');

var RTorrent = function () {
  function RTorrent(opts) {
    _classCallCheck(this, RTorrent);

    this.defaultOpts = {
      scgiPort: _config2.default.get('scgiPort'),
      scgiHost: _config2.default.get('scgiHost'),
      targetPath: _path2.default.join(_config2.default.get('configRoot'), '/downloads')
    };

    this.opts = Object.assign({}, this.defaultOpts, opts);

    _mkdirp2.default.sync(this.opts.targetPath);
  }

  _createClass(RTorrent, [{
    key: 'addTorrent',
    value: function addTorrent(content) {
      // let enc = detectCharacterEncoding(content);
      // console.log('Detected charcter encoding:', enc);
      var parameters = [''];

      parameters.push(content);
      parameters.push('d.directory.set="' + this.opts.targetPath + '"');
      // parameters.push(`d.custom.set=x-filename,RATM-Album`);
      try {
        return _scgi2.default.methodCall('load.raw_start', parameters, this.opts.scgiHost, this.opts.scgiPort);
      } catch (err) {
        _storyboard.mainStory.err('scgi', 'Error while calling scgi', { attach: err });
        return Promise.reject(err);
      }
    }
  }]);

  return RTorrent;
}();

exports.default = RTorrent;
;
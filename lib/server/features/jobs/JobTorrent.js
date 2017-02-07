'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _parseTorrent = require('parse-torrent');

var _parseTorrent2 = _interopRequireDefault(_parseTorrent);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _scgi = require('../downloaders/scgi');

var _scgi2 = _interopRequireDefault(_scgi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jobs = [];

var JobTorrent = function () {
  function JobTorrent(props) {
    _classCallCheck(this, JobTorrent);

    this.defaultProps = {
      scgi: _scgi2.default.methodCall,
      scgiPort: 52461,
      scgiHost: '0.0.0.0'
    };

    this.props = Object.assign({}, this.defaultProps, props);
    (0, _assert2.default)(/^(\d|[a-f]){40}$/i.test(this.props.infoHash));

    if (!this.props._id) {
      this.props._id = _shortid2.default.generate();
    }
  }

  _createClass(JobTorrent, [{
    key: 'getData',
    value: function getData() {
      var _this = this;

      return this.getProgress().then(function (progress) {
        return Promise.resolve(Object.assign({}, {
          _id: _this.props._id,
          type: 'download',
          progress: progress
        }, _this.props.name ? { name: _this.props.name } : {}));
      });
    }
  }, {
    key: 'getProgress',
    value: function getProgress() {
      var _this2 = this;

      var call = function call(name, params) {
        return _this2.props.scgi(name, params, _this2.props.scgiHost, _this2.props.scgiPort);
      };
      return Promise.all([call('d.get_complete', [this.props.infoHash]), call('d.get_bytes_done', [this.props.infoHash]), call('d.get_size_bytes', [this.props.infoHash])]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            complete = _ref2[0],
            done = _ref2[1],
            size = _ref2[2];

        if (complete - 0 === 1) {
          jobs = jobs.filter(function (el) {
            return el.props._id !== _this2.props._id;
          });
          return Promise.resolve(1);
        }
        return Promise.resolve((done - 0) / (size - 0));
      });
    }
  }], [{
    key: 'push',
    value: function push(job) {
      var _jobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jobs;

      _jobs.push(job);
    }
  }, {
    key: 'find',
    value: function find(_ref3) {
      var type = _ref3.type,
          _id = _ref3._id;

      var _jobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jobs;

      return _jobs.filter(function (job) {
        return (!_id || job.props._id === _id) && (!type || job.props.type === type);
      });
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      var _jobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : job;

      return JobTorrent.find({ _id: id }, _jobs)[0];
    }
  }, {
    key: 'fromTorrent',
    value: function fromTorrent(buffer) {
      var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _parseTorrent2.default;

      var parsed = parse(buffer);
      var infoHash = parsed.infoHash;
      var name = parsed.name;
      (0, _assert2.default)(infoHash !== undefined);
      return new JobTorrent({ infoHash: infoHash, name: name });
    }
  }]);

  return JobTorrent;
}();

exports.default = JobTorrent;
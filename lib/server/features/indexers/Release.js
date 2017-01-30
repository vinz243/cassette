'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Release = function () {
  function Release(thisParams) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Release);

    this.defaultOpts = {
      // Format impact score. If release has said format,
      // The matching score will be added to score
      formats: {
        'flac': 50,
        'mp3': 0,
        'wma': -100,
        'wav': -100,
        'unknown': -200
      },
      // Bitrate for each V
      // BR preset, so we can guess bitrate
      vbrBitrates: {
        V0: 245,
        V1: 225,
        V2: 190
      },

      // List of all lossless formats
      losslessFormats: ['flac', 'alac', 'wav', 'wav (pcm)'],

      // Under this treshold, bitrate will negatively impact score
      // Above, it will increase score. This isn't strictly necessary,
      // But for giving a meaning to score details
      bitrateTreshold: 225,

      // How much will it impact. If the bitrate is twice the treshold,
      // the score will be increased by this value. Rest is a lerp
      bitrateMultiplier: 170,

      // How much to increase score if it is a flac
      losslessBonus: 100,

      // How much to increase score if it has logs
      hasLogBonus: 20,

      // How much to increase score if it is a freelech
      freeleechBonus: 50,

      // How much to increase for VBR.
      vbrBonus: 0,

      // seeders impact score using a logistic regression function, defined
      // as follow:
      // f(x) =  λ exp(t(x)/(exp(t(x)) + 1)
      // where t is a linear function of x, t(x) = ax + b
      seedersParams: {
        // The image of t(0), so the offset aka b
        xOffset: -4,
        // The coefficent of t, aka a
        xCoefficient: 1.2,
        // The amplitude of f(x),  λ in the formula
        // Given that f ∈ [0,1], this is the max impact on score
        amplitude: 150,
        // Impact on score when there is no seeders.
        noSeeders: -200
      }
    };

    Object.assign(this, thisParams);
    this.opts = Object.assign({}, this.defaultOpts, opts);
  }

  _createClass(Release, [{
    key: 'score',
    get: function get() {
      return this.scores.reduce(function (a, b) {
        return a + b.amount;
      }, 0);
    },
    set: function set(score) {
      throw new Error('score is read-only');
    }
  }, {
    key: 'format',
    get: function get() {
      return this._format || 'unknown';
    },
    set: function set(f) {
      this._format = f;
    }
  }, {
    key: 'bitrate',
    get: function get() {
      if (this._bitrate) {
        return this._bitrate;
      } else {
        // We dont use this.isVbr because there might be other way to do it
        if (/^V\d\s\(VBR\)$/.test(this.format)) return this.opts.vbrBitrates['V' + this.format[1]] || 0;else return 0;
      }
    },
    set: function set(br) {
      this._bitrate = br;
    }
  }, {
    key: 'isVbr',
    get: function get() {
      return (/^V\d\s\(VBR\)$/.test(this.format)
      );
    }
  }, {
    key: 'lossless',
    get: function get() {
      return this._lossless || this.opts.losslessFormats.includes(this.format.toLowerCase());
    },
    set: function set(l) {
      this._lossless = l;
    }
  }, {
    key: 'scores',
    get: function get() {
      var score = [],
          opts = this.opts;
      if (this.isVbr) {
        score.push({
          amount: opts.vbrBonus,
          desc: 'VBR_BONUS'
        });
      } else {
        if (opts.formats[this.format.toLowerCase()] !== undefined) score.push({
          amount: opts.formats[this.format.toLowerCase()],
          desc: 'FORMAT'
        });else score.push({
          amount: opts.formats.unknown,
          desc: 'UNKNOWN_FORMAT'
        });
      }
      if (this.lossless) {
        score.push({
          amount: opts.losslessBonus,
          desc: 'LOSSLESS_BONUS'
        });
      } else {
        if (this.bitrate !== 0) score.push({
          amount: (this.bitrate - opts.bitrateTreshold) / opts.bitrateTreshold * opts.bitrateMultiplier,
          desc: 'BITRATE'
        });
      }
      if (this.hasLog !== undefined && this.hasLog) {
        score.push({
          amount: opts.hasLogBonus,
          desc: 'HAS_LOG_BONUS'
        });
      }
      if (this.freelech !== undefined && this.freeleech) {
        score.push({
          amount: opts.freeleechBonus,
          desc: 'FREELECH_BONUS'
        });
      }
      if (this.seeders !== undefined && this.seeders > -1) {
        var p = opts.seedersParams;
        if (this.seeders === 0) {
          score.push({
            amount: p.noSeeders,
            desc: 'NOSEEDERS'
          });
        } else {
          var t = p.xCoefficient * this.seeders + p.xOffset;
          var r = p.amplitude * Math.exp(t) / (Math.exp(t) + 1);
          score.push({
            amount: Math.ceil(r),
            desc: 'SEEDERS'
          });
        }
      }
      return score;
    }
  }, {
    key: 'data',
    get: function get() {
      var seeders = this.seeders,
          hasLog = this.hasLog,
          freelech = this.freelech,
          bitrate = this.bitrate,
          score = this.score,
          scores = this.scores,
          isVbr = this.isVbr,
          lossless = this.lossless,
          artist = this.artist,
          album = this.album,
          torrentId = this.torrentId,
          format = this.format,
          encoding = this.encoding,
          _id = this._id;

      return { seeders: seeders, hasLog: hasLog, freelech: freelech, bitrate: bitrate, score: {
          total: score,
          details: scores
        }, isVbr: isVbr, lossless: lossless, artist: artist, album: album, torrentId: torrentId, format: format, encoding: encoding, _id: _id };
    }
  }]);

  return Release;
}();

exports.default = Release;
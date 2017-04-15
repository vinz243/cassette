const {
  assignFunctions,
  defaultFunctions,
  manyToOne,
  legacySupport,
  updateable,
  createable,
  removeable,
  databaseLoader,
  publicProps,
  findOneFactory,
  findFactory,
  findOrCreateFactory,
  defaultValues,
  validator,
  enforce
} = require('models/Model');
const Tracker      = require('./tracker');
const WantedAlbum  = require('./wanted-album');
const trackersList = require('features/store/trackers');

const opts = {
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
      noSeeders: -300
    }
  }

const computeScore = function (props) {
  let score = -10;
  if (props.lossless || props.format === 'flac') {
   score += opts.losslessBonus * (props.want_lossless ? 1 : -1);
  } else {
   if (props.bitrate) {
     if (typeof props.bitrate === 'string'
      && opts.vbrBitrates[props.bitrate.slice(0, 2)]) {
       score += ((opts.vbrBitrates[props.bitrate.slice(0, 2)]
        - opts.bitrateTreshold) / opts.bitrateTreshold)
        * opts.bitrateMultiplier;
     } else {
       score += ((props.bitrate - opts.bitrateTreshold) / opts.bitrateTreshold)
        * opts.bitrateMultiplier;
     }
   }
  }
  if (props.freeleech) {
    score += opts.freeleechBonus;
  }
  if (props.seeders > -1) {
    const p = opts.seedersParams;
    if (!props.seeders) {
      score += p.noSeeders;
    } else {
      const t = (p.xCoefficient * props.seeders) + p.xOffset;
      score += p.amplitude * Math.exp(t) / (Math.exp(t) + 1);
    }
  }
  return Math.ceil(score);
}


// Props:
//   torrent_search: torrent_search the id of the corresponding torrent search
//   tracker:        tracker id that owns the torrent
//   rid:            Short for remote_id. The ID of the torrent on tracker.
//                   Useful for downloading
//   seeders:        Amount of seeders. -1 for unknown
//   leechers:       Amount of leechers. -1 for unknown
//   size:           Size in bytes of the torrent content. 0 or -1 for unknown
//   name:           Name of the torrent on the tracker
//   format:         The format, either `mp3` or `flac`,
//   bitrate:        Average bitrate of the torrentn 0 or -1 for unnknown or flac.

const Torrent = module.exports = function(props) {
  const state = {
    name: 'torrent',
    fields: [
      'wanted_album',
      'tracker',
      'torrent_id',
      'seeders',
      'leechers',
      'size',
      'name',
      'format',
      'bitrate',
      'score',
      'want_lossless',
      'info_hash',
      'dl_progress'
    ],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    createable(state),
    removeable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state),
    manyToOne(state, 'wanted_album'),
    // manyToOne(state, 'tracker'),
    validator(state, {
      wanted_album: [enforce.number(), enforce.required()],
      tracker: [enforce.number(), enforce.required()],
      seeders: enforce.number(),
      leechers: enforce.number(),
      size: enforce.number(),
      name: enforce.string(),
      format: enforce.oneOf('mp3', 'flac'),
      bitrate: enforce.number()
    }),
    defaultValues(state, {
      seeders: -1,
      leechers: -1,
      size: -1,
      bitrate: -1
    }), {
      preCreate: function () {
        state.props.score = computeScore(Object.assign({}, state.props));
      },
      preUpdate: function () {
        state.props.score = computeScore(Object.assign({}, state.props));
      },
  });
}
module.exports.Torrent = Torrent;
const findOne = module.exports.findOne = findOneFactory(Torrent);
const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Torrent);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Torrent, 'torrent');

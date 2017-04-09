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
      'bitrate'
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
    })
  );
}
module.exports.Torrent = Torrent;
const findOne = module.exports.findOne = findOneFactory(Torrent);
const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Torrent);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Torrent, 'torrent');

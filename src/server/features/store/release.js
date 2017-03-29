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
//   release_search: release_search the id of the corresponding torrent search
//   tracker:        tracker id that owns the release
//   rid:            Short for remote_id. The ID of the torrent on tracker.
//                   Useful for downloading
//   seeders:        Amount of seeders. -1 for unknown
//   leechers:       Amount of leechers. -1 for unknown
//   size:           Size in bytes of the torrent content. 0 or -1 for unknown
//   name:           Name of the release on the tracker
//   format:         The format, either `mp3` or `flac`,
//   bitrate:        Average bitrate of the releasen 0 or -1 for unnknown or flac.

const Release = module.exports = function(props) {
  const state = {
    name: 'release',
    fields: [
      'release_search',
      'tracker',
      'rid',
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
    manyToOne(state, 'release_search'),
    manyToOne(state, 'tracker'),
    validator(state, {
      release_search: [enforce.number(), enforce.required()],
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
module.exports.Release = Release;
const findOne = module.exports.findOne = findOneFactory(Release);
const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Release);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Release, 'release');

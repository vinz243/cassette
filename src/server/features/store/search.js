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
  enforce,
  validator,
  defaultValues
} = require('models/Model');

// Props:
//   query:     The query for the item. For instance if searching an album,
//              this should be album name. For a track it should be track name.
//   type:      Either a track or a release. Note that a single is a release
//              Specifies what the search should look for.
//   mrel_type: Release type being searched. Might be album (default), ep,
//              anthology, or just any. This property is inherant to
//              each tracker. Some trackers might not support this.
//   mrel_name: Release Name. For instance `Deluxe Edition`. Can be `any`
//   artist:    The artist of the item that is being looked for.
//   lossless:  Specifies whether to prefer lossless music.
//   mode:      There are 3 possible mode:
//               - `strict`: strict mode. If media release are specified,
//                 only releases that have a matching release are selected,
//                 and trackers that don't supports precise release information
//                 (eg t411) are NOT searched.
//               - `default`: default mode. If media release are specified,
//                 only releases that have a matching release are selected,
//                 and trackers that don't supports precise release information
//                 are searched as well, but matching release is prefered.
//               - `needy`: non-strict mode. Prefer matching release and formats,
//                 but if non match, this will snatch other release
//   state:    Current search status
//               - `created`: Search has just been created, not running
//               - `searching`: Searching trackers
//               - `found`: Found some results, or none
//               - `snatched`: Release snatched, but no feedback from torrent client
//               - `downloading`: Downloading release in torrent client
//               - `downloaded`: Release downloaded
//               - `moved`: Item symlinked from 'downloads' to Library
//               - `done`: Triggers called, item might have been added to library
//               - `no_results`: Search in trackers yielded no suitable result
//               - `errored`: n error happened, check logs for more details

const Search = module.exports = function(props) {
  let state = {
    name: 'release_search',
    fields: [
      'query',
      'type',
      'mrel_name',
      'mrel_type',
      'artist',
      'lossless',
      'state',
      'mode'
    ],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    createable(state),
    updateable(state),
    removeable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state),
    validator(state, {
      query: enforce.string(),
      type: [enforce.oneOf('track', 'release'), enforce.required()],
      release: [enforce.string()],
      artist: [enforce.string()],
      lossless: [enforce.boolean()],
      mode: [enforce.oneOf('strict', 'default', 'needy')],
      state: [
        enforce.oneOf(
          'created', // Search has just been created, not running
          'searching', // Searching trackers
          'found', // Found some results, or none
          'snatched', // Release snatched, but no feedback from torrent client
          'downloading', // Downloading release in torrent client
          'downloaded', // Release downloaded
          'moved', // Item symlinked from 'downloads' to Library
          'done', // Triggers called, item might have been added to library
          'no_results', // Search in trackers yielded no suitable result
          'errored' // An error happened, check logs for more details
        )
      ]
    }), defaultValues(state, {
      state: 'created',
      lossless: false,
      mrel_type: 'any',
      mrel_name: 'any',
      type: 'album'
    }), {
      perform: () => {

      }
    }
  );
}

const findOne = module.exports.findOne = findOneFactory(Search);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Search);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Search, 'release');

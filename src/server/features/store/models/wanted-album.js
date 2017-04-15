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
}                  = require('models/Model');
const Tracker      = require('./tracker');
const trackersList = require('features/store/trackers');
const Rtorrent     = require('features/store/rtorrent');
const assert       = require('assert');
const request      = require('request-promise-native');
const {mainStory}  = require('storyboard');
const thenifyAll   = require('thenify-all');
const musicbrainz  = thenifyAll(require('musicbrainz'));

const WantedAlbum = module.exports = function(props) {
  let state = {
    name: 'wanted_album',
    fields: [
      'mbid',
      'title',
      'partial',
      'download',
      'artist',
      'status',
      'date',
      'auto_search',
      'auto_dl',
      'want_lossless',
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
    defaultValues(state, {
      partial: false,
      status: 'WANTED'
    }),
    validator(state, {
      title: [enforce.string()],
      mbid: [enforce.string(), enforce.required()],
      status: enforce.string(),
      partial: enforce.boolean(),
      auto_dl: enforce.boolean(),
      auto_search: enforce.boolean(),
    }), {
      postCreate: function () {
        // if (state.props.auto_search) {
        //   process.nextTick(() => {
        //     download(state.props._id).catch((err) => {
        //       mainStory.error('store', 'Auto-searching for torrents failed', {
        //         attach: err
        //       });
        //       state.functions.set('status', 'FAILED');
        //       state.functions.update();
        //     });
        //   });
        // }
        return Promise.resolve();
      }
    }
  );
}
const findOne = module.exports.findOne = findOneFactory(WantedAlbum);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(WantedAlbum);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(WantedAlbum, 'wanted_album');

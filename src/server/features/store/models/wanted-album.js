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
const request      = require('request-promise-native');
const {mainStory}  = require('storyboard');
const thenifyAll   = require('thenify-all');
const musicbrainz  = thenifyAll(require('musicbrainz'));

const download = async function (id) {
  const album = await findById(id);
  const {set, update, props} = album;

  if (!props.artist || !props.name) {
    const res = await musicbrainz.lookupReleaseGroup(props.mbid,
      ['artists']);

    const artist = res.artistCredits[0].artist;
    album.set('title', res.title);
    album.set('artist', artist.name);
    album.set('date', res.firstReleaseDate);
    await album.update();
  }
  if (props.partial) {
    throw 'Partial downloads not implemented yet :/';
  }
  if (props.status !== 'WANTED') {
    throw 'Entry already being searched';
  }
  set('status', 'SEARCHING_TRACKERS');

  await update();
  const promises = (await Tracker.find({})).map(async (tracker) => {
    try {
      const api = await trackersList[tracker.props.type](request, tracker);

      await api.searchReleases(album);
    } catch (err) {
      mainStory.warn('store', `Couldn't search ${tracker.props.name}`, {
        attach: err
      })
    }
  });
  await Promise.all(promises);
  set('status', 'SEARCHED');
  await update();
}

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
      'auto_dl'
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
        if (state.props.auto_search) {
          process.nextTick(() => {
            download(state.props._id).catch((err) => {
              mainStory.error('store', 'Auto-searching for torrents failed', {
                attach: err
              });
              state.functions.set('status', 'FAILED');
              state.functions.update();
            });
          });
        }
        return Promise.resolve();
      },
      download: async function () {
        try {
          await download(state.props._id);
        } catch (err) {
          mainStory.error('store', 'Searching for torrents failed', {
            attach: err
          });
          state.functions.set('status', 'FAILED');
          state.functions.update();
        }
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

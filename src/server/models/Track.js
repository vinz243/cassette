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
  findOrCreateFactory
} = require('./Model');

const Track = module.exports = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'track',
    fields: ['name', 'album', 'artist', 'duration', 'trackNumber'],
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
    manyToOne(state, 'album'),
    manyToOne(state, 'artist')
  );
}
module.exports.Track = Track;
const findOne = module.exports.findOne = findOneFactory(Track);
const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Track);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Track, 'track');

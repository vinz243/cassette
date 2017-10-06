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

const File = module.exports = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'file',
    fields: [
      'size',
      'path',
      'album',
      'track',
      'format',
      'artist',
      'bitrate',
      'duration',
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
    manyToOne(state, 'album'),
    manyToOne(state, 'artist'),
    manyToOne(state, 'track')
  );
}
module.exports.File = File;

const findOne = module.exports.findOne = findOneFactory(File);
const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(File);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(File, 'file');

const model = require('./Model');


const Album = module.exports = function (props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'album',
    fields: ['name', 'year', 'artist'],
    functions: {},
    populated: {},
    props
  };
  return model.assignFunctions(
    state.functions,
    model.defaultFunctions(state),
    model.updateable(state),
    model.createable(state),
    model.removeable(state),
    model.databaseLoader(state),
    model.publicProps(state),
    model.legacySupport(state),
    model.manyToOne(state, 'artist')
  );
}

module.exports.Album = Album;

const findOne = module.exports.findOne = model.findOneFactory(Album);
const findOrCreate = module.exports.findOrCreate = model.findOrCreateFactory(Album);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = model.findFactory(Album, 'album');

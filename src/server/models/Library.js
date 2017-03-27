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
  findFactory
} = require('./Model');

const Library = module.exports = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'library',
    fields: ['name', 'path'],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    removeable(state),
    createable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state)
  );
}
module.exports.Library = Library;

const findOne = module.exports.findOne = findOneFactory(Library);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Library, 'library');

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

const WantedItem = module.exports = function(props) {
  let state = {
    name: 'wanted_item',
    fields: ['mbid', 'name', 'wanted_album'],
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
    validator(state, {
      name: [enforce.string(), enforce.required()],
      mbid: [enforce.string(), enforce.required()],
      wanted_album: [enforce.number(), enforce.required()]
    })
  );
}

const findOne = module.exports.findOne = findOneFactory(WantedItem);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(WantedItem);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(WantedItem, 'wanted_item');

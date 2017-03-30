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

const WantedAlbum = module.exports = function(props) {
  let state = {
    name: 'wanted_album',
    fields: ['mbid', 'name', 'partial'],
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
      status: 'wanted'
    }),
    validator(state, {
      name: [enforce.string(), enforce.required()],
      mbid: [enforce.string(), enforce.required()],
      status: enforce.string(),
      partial: enforce.boolean()
    })
  );
}

const findOne = module.exports.findOne = findOneFactory(WantedAlbum);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(WantedAlbum);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(WantedAlbum, 'wanted_album');

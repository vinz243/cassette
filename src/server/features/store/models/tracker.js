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
  validator
} = require('models/Model');

const Tracker = module.exports = function(props) {
  let state = {
    name: 'tracker',
    fields: ['name', 'type', 'username', 'password', 'host', 'score', 'status'],
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
      name: [enforce.string()],
      type: [enforce.oneOf('gazelle', 't411')],
      status: [enforce.oneOf('UNCONFIRMED', 'CONFIRMED', 'INVALID')],
      username: enforce.string(),
      password: enforce.string(),
      host: enforce.string(),
      score: enforce.number()
    })
  );
}

const findOne = module.exports.findOne = findOneFactory(Tracker);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Tracker);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Tracker, 'tracker');

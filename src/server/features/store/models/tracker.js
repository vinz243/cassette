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
const {mainStory} = require('storyboard')
const trackersList = require('features/store/trackers');
const request = require('request-promise-native');

const checkStatus = async function (id, fields) {
  const tracker = await findById(id);

  if (fields && fields.every(el => ['status', 'message'].includes(el))) {
    return;
  }
  tracker.set('status', 'UNCONFIRMED');
  await tracker.update();
  try {
    const api = await trackersList[tracker.props.type](request, tracker);
  } catch (err) {
    mainStory.error('trackers', `Tracker ${tracker.props.name} doesn't work`, {
      attach: err
    });
    tracker.set('status', 'INVALID');
    tracker.set('message', err.message);
    await tracker.update();
  }

}

const Tracker = module.exports = function(props) {
  let state = {
    name: 'tracker',
    fields: ['name', 'type', 'username', 'password', 'host', 'score', 'status', 'message'],
    functions: {},
    populated: {},
    dirtyFields: [],
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
    }), {
    postUpdate: () => {
      checkStatus(state.props._id, state.dirtyFields).catch((err) => {
        mainStory.error('tracker', 'Error', {
          attach: err
        });
      });
      return Promise.resolve();
    },
    postCreate: () => {
      checkStatus(state.props._id, []);
      return Promise.resolve();
    },
    checkStatus: () => {
      return checkStatus(state.props._id);
    }
  });
}

const findOne = module.exports.findOne = findOneFactory(Tracker);

const findOrCreate = module.exports.findOrCreate = findOrCreateFactory(Tracker);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Tracker, 'tracker');

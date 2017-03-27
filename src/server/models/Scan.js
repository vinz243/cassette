const child_process = require("child_process");
const chalk         = require("chalk");
const Library       = require('./Library');

const {scan}      = require('../features/scanner/scanner');
const {mainStory} = require('storyboard');
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

const Scan = module.exports.Scan = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'scan',
    fields: [
      'statusCode',
      'statusMessage',
      'library',
      'dryRun',
      'mode',
      'duration',
      'date'
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
    databaseLoader(state),
    publicProps(state),
    legacySupport(state), {
      postCreate: () => {
        process.nextTick(() => {
          if ((state.props.mode || '').toLowerCase() === 'all') {
            let time = 0;
            let hasErrors = false;

            return findLibraries({}).then((libs) => {
              time = Date.now();
              return Promise.all(libs.map(lib => scan(lib.props._id)));
            }).then(() => {
              if (hasErrors) {
                state.functions.set('statusCode', 'FAILED');
                state.functions.set('statusMessage',
                  'At least one scan failed with errors. ' +
                  'Please check the logs for more details...');
                state.functions.update().catch(err => {
                  mainStory.fatal('scanner', 'Could not update scan', {attach: err});
                });
                return;
              }
              mainStory.info('scanner', 'All scans finished without raising error.');
              state.functions.set('statusCode', 'DONE');
              state.functions.set('statusMessage', 'Scan finished without error.');
              state.functions.set('duration', Date.now() - time);

              return state.functions.update();
            }).catch((e) => {
              hasErrors = true;
              mainStory.error('scanner', 'One scan failed with errors', {attach: e});
            });
          }
          if (!state.props._id) {
            mainStory.warn('scanner', 'Scan wasn\'t created. Aborting');
            return;
          }
          try {
            scan(state.props.library).then(() => {
              mainStory.info('scanner', 'Scan finished without raising errors');
              state.functions.set('statusCode', 'DONE');
              state.functions.set('statusMessage', 'Scan finished without errors.');

              return;
            }).catch((err) => {
              mainStory.error('scanner', 'Scan failed with errors', {attach: err});
              state.functions.set('statusCode', 'FAILED');
              state.functions.set('statusMessage', 'Scan failed with errors. Please check the logs for more details...');
              state.functions.update().catch(err => {
                mainStory.fatal('scanner', 'Could not update scan', {attach: err});
              })
            });
          } catch (err) {
            mainStory.fatal('scanner', 'Scanner crashed unexpectedly.', {attach: err});

          }
        });

      }
    }
  );
}

const findOne = module.exports.findOne = findOneFactory(Scan);

const findById = module.exports.findById = (_id) => findOne({
  _id
});

const find = module.exports.find = findFactory(Scan, 'scan');

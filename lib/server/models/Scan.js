'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.findById = exports.findOne = exports.Scan = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _Library = require('./Library');

var _Model = require('./Model');

var _scanner = require('../features/scanner/scanner');

var _storyboard = require('storyboard');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scan = exports.Scan = function Scan(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  var state = {
    name: 'scan',
    fields: ['statusCode', 'statusMessage', 'library', 'dryRun'],
    functions: {},
    populated: {},
    props: props
  };
  return (0, _Model.assignFunctions)(state.functions, (0, _Model.defaultFunctions)(state), (0, _Model.updateable)(state), (0, _Model.createable)(state), (0, _Model.databaseLoader)(state), (0, _Model.publicProps)(state), (0, _Model.legacySupport)(state), {
    startScan: function startScan() {
      if (!state.props._id) {
        _storyboard.mainStory.warn('scanner', 'Scan wasn\'t created. Aborting');
        return;
      }
      try {
        (0, _scanner.scan)(state.props._id).then(function () {
          _storyboard.mainStory.info('scanner', 'Scan finished without raising errors');
          state.functions.set('statusCode', 'DONE');
          state.functions.set('statusMessage', 'Scan finished without errors.');

          return;
        }).catch(function (err) {
          _storyboard.mainStory.error('scanner', 'Scan failed with errors', { attach: err });
          state.functions.set('statusCode', 'FAILED');
          state.functions.set('statusMessage', 'Scan failed with errors. Please check the logs for more details...');
          state.functions.update().catch(function (err) {
            _storyboard.mainStory.fatal('scanner', 'Could not update scan', { attach: err });
          });
        });
      } catch (err) {
        _storyboard.mainStory.fatal('scanner', 'Scanner crashed unexpectedly.', { attach: err });
      }
    }
  });
};

var findOne = exports.findOne = (0, _Model.findOneFactory)(Scan);

var findById = exports.findById = function findById(_id) {
  return findOne({
    _id: _id
  });
};

var find = exports.find = (0, _Model.findFactory)(Scan, 'scan');
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.findById = exports.findOne = exports.Library = undefined;

var _Model = require('./Model');

var Library = exports.Library = function Library(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  var state = {
    name: 'library',
    fields: ['name', 'path'],
    functions: {},
    populated: {},
    props: props
  };
  return (0, _Model.assignFunctions)(state.functions, (0, _Model.defaultFunctions)(state), (0, _Model.updateable)(state), (0, _Model.removeable)(state), (0, _Model.createable)(state), (0, _Model.databaseLoader)(state), (0, _Model.publicProps)(state), (0, _Model.legacySupport)(state));
};

var findOne = exports.findOne = (0, _Model.findOneFactory)(Library);

var findById = exports.findById = function findById(_id) {
  return findOne({
    _id: _id
  });
};

var find = exports.find = (0, _Model.findFactory)(Library, 'library');
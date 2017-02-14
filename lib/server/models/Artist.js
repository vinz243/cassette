'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.findById = exports.findOrCreate = exports.findOne = exports.Artist = undefined;

var _Model = require('./Model');

var Artist = exports.Artist = function Artist(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  var state = {
    name: 'artist',
    fields: ['name', 'genre'],
    functions: {},
    populated: {},
    props: props
  };
  return (0, _Model.assignFunctions)(state.functions, (0, _Model.defaultFunctions)(state), (0, _Model.updateable)(state), (0, _Model.createable)(state), (0, _Model.removeable)(state), (0, _Model.databaseLoader)(state), (0, _Model.publicProps)(state), (0, _Model.legacySupport)(state));
};

var findOne = exports.findOne = (0, _Model.findOneFactory)(Artist);

var findOrCreate = exports.findOrCreate = (0, _Model.findOrCreateFactory)(Artist);

var findById = exports.findById = function findById(_id) {
  return findOne({
    _id: _id
  });
};

var find = exports.find = (0, _Model.findFactory)(Artist, 'artist');
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _indexers = require('./indexers');

var _indexers2 = _interopRequireDefault(_indexers);

var _downloaders = require('./downloaders');

var _downloaders2 = _interopRequireDefault(_downloaders);

var _artworks = require('./artworks');

var _artworks2 = _interopRequireDefault(_artworks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Object.assign({}, _store2.default, _indexers2.default, _downloaders2.default, _artworks2.default);
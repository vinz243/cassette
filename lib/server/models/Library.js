'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Scan = require('./Scan');

var _Scan2 = _interopRequireDefault(_Scan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Library = new _Model2.default('library').field('name').string().required().defaultParam().done().field('path').string().done().oneToMany(_Scan2.default, 'libraryId').done();

exports.default = Library;
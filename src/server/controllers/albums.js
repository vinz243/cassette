const Artist  = require('../models/Artist');
const Album   = require('../models/Album');
const Track   = require('../models/Track');
const File    = require('../models/File');

const {fetchable, oneToMany, updateable} = require('./Controller');
const merge = require("lodash/merge");


module.exports = merge({},
  fetchable('album', Album.find, Album.findById),
  updateable('album', Album.findById),
  oneToMany('album', 'track', Track.find),
  oneToMany('album', 'file', File.find)
);

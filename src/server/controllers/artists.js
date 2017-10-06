const Artist  = require('../models/Artist');
const Album   = require('../models/Album');
const Track   = require('../models/Track');
const File    = require('../models/File');

const merge   = require("lodash/merge");

const {fetchable, oneToMany, updateable} = require('./Controller');


module.exports = merge({},
  fetchable('artist', Artist.find, Artist.findById),
  updateable('artist', Artist.findById),
  oneToMany('artist', 'album', Album.find),
  oneToMany('artist', 'track', Track.find),
  oneToMany('artist', 'file', File.find)
);

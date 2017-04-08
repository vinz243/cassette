const Tracker = require('features/store/models/tracker');

const {fetchable, oneToMany, updateable, createable} = require('controllers/Controller');
const merge   = require("lodash/merge");

module.exports = merge({},
  fetchable('tracker', Tracker.find, Tracker.findById),
  createable('tracker', Tracker),
  updateable('tracker', Tracker.findById)
);

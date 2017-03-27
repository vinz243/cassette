const {fetchable, oneToMany, updateable, createable} = require('./Controller');
const merge = require("lodash/merge");
const process = require("process");
const Scan = require('../models/Scan');


module.exports = merge({},
  fetchable('scan', Scan.find, Scan.findById), createable('scan', Scan)
);

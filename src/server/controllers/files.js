const {Artist, Album, Track, File} = require('../models');
const Controller = require("./Controller");

const routes = new Controller(File).done();

module.exports = routes;

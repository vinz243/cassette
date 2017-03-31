
const artworks = require("./artworks");
const jobs     = require("./jobs");
const updater  = require("./updater");
const store    = require("./store");

module.exports = Object.assign({

}, store, artworks, jobs, updater);

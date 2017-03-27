// const search = require("./store");
// const indexers = require("./indexers");
// const downloaders = require("./downloaders");
const artworks = require("./artworks");
const jobs     = require("./jobs");
const updater  = require("./updater");

module.exports = Object.assign({

}, /*search, indexers, downloaders,*/ artworks, jobs, updater);

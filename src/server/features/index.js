
const artworks = require("./artworks");
const updater  = require("./updater");
const store    = require("./store");

module.exports = Object.assign({

}, store, artworks, updater);

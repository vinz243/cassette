
const artworks = require("./artworks");
const updater  = require("./updater");
const store    = require("./store");
const checks    = require("./checks");

module.exports = Object.assign({

}, store, artworks, updater, checks);

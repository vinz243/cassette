// 52461
const fs = require('fs');
const RTorrent = require('./lib/server/features/downloaders/rTorrent');
// console.log(RTorrent);
let rt = new RTorrent.default();

rt.addTorrent(fs.readFileSync('../Downloads/ratm3.torrent'));

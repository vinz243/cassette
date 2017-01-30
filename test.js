// 52461
const fs = require('fs');
const RTorrent = require('./lib/server/features/downloaders/rTorrent');
// console.log(RTorrent);
let rt = new RTorrent.default();

var detectCharacterEncoding = require('detect-character-encoding');

console.log(detectCharacterEncoding(fs.readFileSync('../Downloads/led.torrent')));

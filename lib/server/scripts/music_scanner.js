'use strict';

var assert = require('assert');
var scanpel = require('scanpel');
var Mediastic = require('mediastic');

var mediastic = Mediastic();
var config = {};

var execute = function execute(data) {
  assert(data.action === 'execute');
  assert(config && config.dir);

  var log = function log(msg) {
    process.send({
      status: 'LOG',
      msg: msg
    });
  };

  mediastic.use(function (metadata, next) {
    log('Working on ' + metadata.path);
    next();
  });

  mediastic.use(Mediastic.tagParser());
  mediastic.use(Mediastic.fileNameParser());
  mediastic.use(Mediastic.spotifyApi({
    albumKeywordBlacklist: /deluxe|renditions|explicit|edited|performs/i,
    durationTreshold: 5
  }));

  mediastic.use(function (metadata, next) {
    log('Done ' + metadata.path);
    next();
  });

  var res = scanpel(config.dir, mediastic).then(function (res) {
    process.send({
      status: 'done',
      data: res
    });
  });
};

var setConfig = function setConfig(data) {
  config = data.data;
};

process.on('message', function (data) {
  if (data.action === 'execute') {
    execute(data);
  } else if (data.action === 'set_config') {
    setConfig(data);
  }
});
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(mediastic, 'mediastic', 'src/server/scripts/music_scanner.js');

  __REACT_HOT_LOADER__.register(config, 'config', 'src/server/scripts/music_scanner.js');

  __REACT_HOT_LOADER__.register(execute, 'execute', 'src/server/scripts/music_scanner.js');

  __REACT_HOT_LOADER__.register(setConfig, 'setConfig', 'src/server/scripts/music_scanner.js');
})();

;
#! /usr/bin/env node

require('babel-polyfill');
// console.log(require('config.js'));
const path = require('path');
const config = require('./lib/server/config');
const express = require('express');
const backend = require('./lib/server/server').default;
// const serveStatic = require('serve-static');
const processResult = require('./lib/server/models/Scan').processResult;
// console.log(backend);
const assert = require('assert');
const app = express();

const host = config.get('host');
const port = config.get('port');

assert.is(config.get('env'), 'production');

const callback = backend.app.callback();

app.use((req, res, next) => {
  if(req.path.startsWith('/v1/')) {
    callback(req, res);
} else {
  next();
}
});

app.use(express.static('./build/client'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/client/index.html'));
});

app.listen(port, host, (err) => {
  if (err) {
    log(err);
    return;
  }

  console.log('App is listening at http://%s:%s', host, port);
});

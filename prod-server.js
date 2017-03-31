#! /usr/bin/env node

// console.log(require('config.js'));
const path = require('path');
const config = require('./src/server/config');
const express = require('express');
const backend = require('./src/server/server').default;

const assert = require('assert');
const app = express();

const host = config.get('ip');
const port = config.get('port');

assert.equal(config.get('env'), 'production');

const callback = backend.app.callback();

app.use((req, res, next) => {
  if (req.path.startsWith('/v1/')) {
    callback(req, res);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, './build/client/')));

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

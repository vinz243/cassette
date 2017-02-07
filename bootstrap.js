const express = require('express'),
  http = require('http'),
  cp = require('child_process'),
  spawn = cp.spawn,
  exec = cp.exec,
  app = express()
shortid = require('shortid');
const recordToLine = require('storyboard/lib/listeners/helpers/recordToLines').default;
let child;

const random_port = require('random-port');
const uid = shortid.generate();
const throttle = require('lodash/throttle');


function updateApp(req, res) {
  spawn('yarn', ['global', 'add', 'node-cassette']).on('close', function() {
    if (res) {
      res.status(201).send({success: true});
    }
  });
}
function log(msg, level) {
  console.log(recordToLine({
    t: Date.now(),
    src: 'bootstrap',
    level: level || 30,
    msg: msg
  }, {moduleNameLength: 20})[0].text);
}
random_port(function(port) {
  function startApp() {
    child = spawn('node', ['./prod-server.js',
      'http://localhost:' + port + '/' + uid
    ], {
      env: Object.assign({}, process.env, {
        NODE_ENV: 'production'
      }),
      // stdio:  ['pipe', process.stdout, process.stderr]
    });
    child.stdout.on('data', function(data) {
      let str = data.toString()
      console.log(str);
    });
    child.stderr.on('data', function(data) {
      let str = data.toString()
      console.log(str);
    });
    child.on('close', function(code) {
      log('cassette server stopped itself... restarting');
      setTimeout(startApp, 2000)
    });
  }
  app.post('/' + uid + '/update', updateApp);
  app.post('/' + uid + '/restart', function(req, res) {
    res.status(201).send({success: true});
    log('bootstrap server triggering restart...');
    setTimeout(function () {
      if (child) {
        child.kill();
        log('child killed');
      }
      // startApp();
    }, 200);
  });
  startApp();
  http.createServer(app).listen(port, function(){
    log('bootstrap server listening on port ' + port);
  });
})

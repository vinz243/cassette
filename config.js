
const process = require('process');
const shortid = require('shortid');
const os = require('os');

if (!process.argv.includes('--dev')) {
  var env = 'test';
} else {
  var env = 'dev';
}
let localConfig = {
  dev: {},
  test: {}
};
try {
  localConfig = require('./config.local.json');
} catch (err) {
  if (env !== 'production') {
    localConfig[env].rootDir = os.homedir() + '/';
  } else { 
    throw err;
  }
}

env = localConfig.env || env;

let root = localConfig[env].rootDir;

module.exports = {
  rootDir: env === 'test' ? root + 'test/' + shortid.generate() : root,
  baseDir: root
};


import process from 'process';
import shortid from 'shortid';
import os from 'os';

if (!process.argv.includes('--dev')) {
  var env = 'test';
} else {
  var env = 'dev';
}
let localConfig = {};
try {
  localConfig = require('./config.local.json');
} catch (err) {
  if (env !== 'production') {
    localConfig[env].rootDir = os.homedir();
  }
}

env = localConfig.env || env;



let root = localConfig[env].rootDir;

export default {
  rootDir: env === 'test' ? root + 'test/' + shortid.generate() : root,
  baseDir: root
};

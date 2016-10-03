
import process from 'process';
import shortid from 'shortid';

import localConfig from './config.local.json';

if (!process.argv.includes('--dev')) {
  var env = 'test';
} else {
  var env = 'dev';
}
env = localConfig.env || env;



let root = localConfig[env].rootDir;

export default {
  rootDir: env === 'test' ? root + 'test/' + shortid.generate() : root,
  baseDir: root
};

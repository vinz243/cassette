
import process from 'process';
import shortid from 'shortid';

import localConfig from './config.json';

if (!process.argv.includes('--dev')) {
  var env = 'test';
} else {
  var env = 'dev';
}



let root = localConfig[env].rootDir;

export default {
  rootDir: env === 'test' ? root + 'test/' + shortid.generate() : root,
  baseDir: root
};

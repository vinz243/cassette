import process from 'process';

import localConfig from './config.json';

if (process.argv.includes('--test')) {
  var env = 'test';
} else {
  var env = 'dev';
}

let config = localConfig[env];
config.env = env;

export default config;

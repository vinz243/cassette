const convict = require('convict');
const os = require('os');
const path = require('path');
const shortid = require('shortid');
const finder = require('find-package-json');
const fs = require('fs');

const conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 9000,
    env: "PORT"
  },
  configRoot: {
    doc: "The config root.",
    format: "*",
    default: path.join(os.homedir(), '.cassette/'),
    env: "CONFIG_ROOT"
  },
  configDir: {
    doc: "The config directory, files will be written to root + dir",
    format: "*",
    default: "",
    env: "CONFIG_DIR"
  },
  pthUsername: {
    doc: "The PTH username. Should be removed",
    format: "*",
    default: "",
    env: "PTH_USERNAME"
  },
  pthPassword: {
    doc: "The PTH Password. Should be removed",
    format: "*",
    default: "",
    env: "PTH_PASSWORD"
  }
});
// Load environment dependent configuration
var env = conf.get('env');

let paths = [
  path.join(__dirname, '../../config/backend.' + env + '.json'),
  path.join(__dirname, '../../secure.json')
];

let localConfig = path.join(os.homedir(), '/.cassette/config.json');
if (fs.existsSync(localConfig)) {
  paths.push(localConfig);
}
conf.loadFile(paths);

// Perform validation
conf.validate({strict: true});

if (env === 'test') {
  conf.set('configPath', path.join(conf.get('configRoot'),
    conf.get('configDir'), shortid.generate()));
} else {
  conf.set('configPath', path.join(conf.get('configRoot'),
    conf.get('configDir')));
}

module.exports = conf;

//
// const process = require('process');
// const shortid = require('shortid');
// const os = require('os');
//
// if (!process.argv.includes('--dev')) {
//   var env = 'test';
// } else {
//   var env = 'dev';
// }
// let localConfig = {
//   dev: {},
//   test: {}
// };
// try {
//   localConfig = require('./config.local.json');
// } catch (err) {
//   if (env !== 'production') {
//     localConfig[env].rootDir = os.homedir() + '/';
//   } else {
//     throw err;
//   }
// }
//
// env = localConfig.env || env;
//
// let root = localConfig[env].rootDir;
// module.exports = {
//   rootDir: env === 'test' ? root + 'test/' + shortid.generate() : root,
//   baseDir: root,
//   pthUsername: localConfig.pthUsername,
//   pthPassword: localConfig.pthPassword
// };
// console.log(module.exports.rootDir);

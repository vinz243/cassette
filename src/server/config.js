const convict = require('convict');
const os = require('os');
const path = require('path');
const shortid = require('shortid');
const finder = require('find-package-json');
const fs = require('fs');
const mainStory = require('storyboard').mainStory;

const story = mainStory.child({
  src: 'config',
  title: 'Configuration module',
  level: 'INFO',
})

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
  },
  scgiPort: {
    doc: "The SCGI port of rTorrent",
    format: "port",
    default: "52461",
    env: "SCGI_PORT"
  },
  scgiHost: {
    doc: "The SCGI host of rTorrent",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "SCGI_HOST"
  }
});
// Load environment dependent configuration
var env = conf.get('env');

let paths = [
  path.join(__dirname, '../../config/backend.' + env + '.json')
];

let secureConfig = path.join(__dirname, '../../secure.json');
if (fs.existsSync(secureConfig)) {
  paths.push(secureConfig);
  story.info('config', `loading configuration from '${secureConfig}'...`);
}
let localConfig = path.join(os.homedir(), '/.cassette/config.json');
if (fs.existsSync(localConfig)) {
  story.info('config', `loading configuration from '${localConfig}'...`);
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
let props = conf.getProperties();
props['pthPassword'] = props['pthPassword'].length > 0 ? '<written out>' : '';
story.debug('config', 'resolved configuration is', {attach: props});

let username = conf.get('pthUsername');
if (!username || username === '') {
  story.warn('config', 'no PTH username specified. store will NOT work');
}

story.close();
module.exports = conf;

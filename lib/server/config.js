'use strict';

var convict = require('convict');
var os = require('os');
var path = require('path');
var shortid = require('shortid');
var finder = require('find-package-json');
var fs = require('fs');
var mainStory = require('storyboard').mainStory;

var story = mainStory.child({
  src: 'config',
  title: 'Configuration module',
  level: 'INFO'
});

var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "production",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS"
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
  },
  lastFMAPIKey: {
    doc: "Last.fm API key",
    format: '*',
    default: '85d5b036c6aa02af4d7216af592e1eea',
    env: 'LAST_FM_API_KEY'
  }
});
// Load environment dependent configuration
var env = conf.get('env');

var paths = [path.join(__dirname, '../../config/backend.' + env + '.json')];

var secureConfig = path.join(__dirname, '../../secure.json');
if (fs.existsSync(secureConfig)) {
  paths.push(secureConfig);
  story.info('config', 'loading configuration from \'' + secureConfig + '\'...');
}
var localConfig = path.join(os.homedir(), '/.cassette/config.json');
if (fs.existsSync(localConfig)) {
  story.info('config', 'loading configuration from \'' + localConfig + '\'...');
  paths.push(localConfig);
}
conf.loadFile(paths);

// Perform validation
conf.validate({ strict: true });

if (env === 'test') {
  conf.set('configPath', path.join(conf.get('configRoot'), conf.get('configDir'), shortid.generate()));
} else {
  conf.set('configPath', path.join(conf.get('configRoot'), conf.get('configDir')));
}
var props = conf.getProperties();
story.debug('config', 'resolved configuration is', {
  attach: Object.assign({}, props, {
    pthPassword: props['pthPassword'].length > 0 ? '<written out>' : ''
  })
});

var username = conf.get('pthUsername');
if (!username || username === '') {
  story.warn('config', 'no PTH username specified. store will NOT work');
}

story.close();
module.exports = conf;
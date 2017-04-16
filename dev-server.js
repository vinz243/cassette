let backend = null;
let socket  = null;

function loadAPI() {
  backend = require('./src/server/server');
  socket = require('./src/server/socket');
}
loadAPI();

const dependencies = Object.keys(require.cache);

const path = require('path');
const watch = require('node-watch');

const express              = require('express');
const webpack              = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin      = require('webpack-dashboard/plugin');
const config                = require('./config/webpack.config.development');
const http                 = require('http');

// const nodeRequire = require;
// require = Object.assign(function (module) {
//   if (!dependencies.includes(module)) {
//     dependencies.push(module);
//   }
//   return nodeRequire(module);
// }, nodeRequire);


const api = process.argv.includes('--api');

if (api) {
  console.log('Warning: running server as API only');
}
console.log(`Watching folder ${path.join(__dirname, 'src/server')}`);

watch(path.join(__dirname, 'src/server'), {recursive: true},
  function(event, filename) {
  console.warn(` `);
  console.warn(`   ${filename} was ${event}d, reloading API server`);
  console.warn(`  `);
  const node_modules = path.join(__dirname, 'node_modules');
  const excludes = [
    'src/server/config.js'
  ].map((file) => path.join(__dirname, file));

  dependencies.forEach((module) => {
    if (module.startsWith(path.join(node_modules, 'sharp'))) {
      return;
    }
    if (excludes.includes(module)) {
      return
    }
    delete require.cache[module];
  });

  loadAPI();
})

// const processResult = require('./src/server/models/Scan').processResult;
// console.log(backend);

const app = express();

const server = http.createServer(app);
socket(server);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

function log() {
  arguments[0] = '\nWebpack: ' + arguments[0];
  console.log.apply(console, arguments);
}

const callback = backend.app.callback();

app.use((req, res, next) => {
  if(req.path.startsWith('/v1/') || req.path.startsWith('/api/')) {
    callback(req, res);
} else {
  next();
}
});

if (!api) {
  const compiler = webpack(config);

  // Apply CLI dashboard for your webpack dev server
  compiler.apply(new DashboardPlugin());

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    historyApiFallback: true
  }));


  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './src/client/assets/index.html'));
  });
}

server.listen(port, host, (err) => {
  if (err) {
    log(err);
    return;
  }

  log('🚧  App is listening at http://%s:%s', host, port);

  // log('\nTrying to inject some mock data...');
  //
  // const mockData = require('./data/libraryMockup.json');
  //
  // processResult({
  //   status: 'done',
  //   data: mockData
  // }).then(() => {
  //   log('\n Mocking done');
  // });
});

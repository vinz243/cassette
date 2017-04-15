// Creates a hot reloading development environment
// process.env.NODE_PATH = __dirname;
// require('module').Module._initPaths();

require('babel-polyfill');
// console.log(require('config.js'));
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');
const backend = require('./src/server/server');

const api = process.argv.includes('--api');

if (api) {
  console.log('Warning: running server as API only');
}

// const processResult = require('./src/server/models/Scan').processResult;
// console.log(backend);

const app = express();

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
app.listen(port, host, (err) => {
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

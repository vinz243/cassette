// Creates a hot reloading development environment
require('babel-polyfill');

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');
const backend = require('./lib/server/server').default;

const processResult = require('./lib/server/models/Scan').processResult;
// console.log(backend);

const app = express();
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

function log() {
  arguments[0] = '\nWebpack: ' + arguments[0];
  console.log.apply(console, arguments);
}

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}));

app.use(webpackHotMiddleware(compiler));
const callback = backend.app.callback();
app.use((req, res, next) => {
  if(req.path.startsWith('/v1/')) {
    callback(req, res);
} else {
  next();
}
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/client/assets/index.html'));
});

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

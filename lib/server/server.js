'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaBetterBody = require('koa-better-body');

var _koaBetterBody2 = _interopRequireDefault(_koaBetterBody);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
var router = (0, _koaRouter2.default)();

app.use(function (ctx, next) {
  var start = new Date();
  return next().then(function () {
    var ms = new Date() - start;
    // console.log(chalk.dim(`    ${ctx.method} ${ctx.url} - ${ms}ms - ${ctx.status}`));
  });
});

app.use((0, _koaConvert2.default)((0, _koaBetterBody2.default)()));

(0, _routes2.default)(router);

app.use(router.routes());
app.use(router.allowedMethods());

var res = app.listen();
res.app = app;
var _default = res;
exports.default = _default;
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(app, 'app', 'src/server/server.js');

  __REACT_HOT_LOADER__.register(router, 'router', 'src/server/server.js');

  __REACT_HOT_LOADER__.register(res, 'res', 'src/server/server.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/server/server.js');
})();

;
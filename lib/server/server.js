'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaBetterBody = require('koa-better-body');

var _koaBetterBody2 = _interopRequireDefault(_koaBetterBody);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _storyboard = require('storyboard');

var _console = require('storyboard/lib/listeners/console');

var _console2 = _interopRequireDefault(_console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _storyboard.addListener)(_console2.default);

_storyboard.mainStory.info('Storyboard started');
_storyboard.mainStory.info('Starting server');

var app = new _koa2.default();
var router = (0, _koaRouter2.default)();
app.use(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    var start, color, _color;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            start = Date.now();
            _context.prev = 1;
            _context.next = 4;
            return next();

          case 4:
            color = 'green';

            if (ctx.status >= 400) color = 'red';
            _storyboard.mainStory.debug(ctx.method + ' ' + _chalk2.default.underline.dim(ctx.url) + (' ' + (Date.now() - start) + 'ms ') + _chalk2.default[color](ctx.status));
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            _color = 'red';

            _storyboard.mainStory.error(ctx.method + ' ' + _chalk2.default.underline.dim(ctx.url) + (' ' + (Date.now() - start) + 'ms ') + _chalk2.default[_color](ctx.status), { attach: _context.t0 });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.use((0, _koaConvert2.default)((0, _koaBetterBody2.default)()));

(0, _routes2.default)(router);

app.use(router.routes());
app.use(router.allowedMethods());

var res = app.listen();
res.app = app;
exports.default = res;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _models = require('../models');

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var routes = new _Controller2.default(_models.Library).allowPost().done();

routes['/v1/libraries/:id/scans'].post = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    var scan;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scan = new _models.Scan(ctx.params.id);

            scan.data.statusMessage = 'Pending...';
            scan.data.statusCode = 'PENDING';
            scan.data.dryRun = (ctx.request.fields || ctx.request.body || {}).dryRun || false;
            _context.next = 6;
            return scan.create();

          case 6:

            ctx.status = 201;
            ctx.body = {
              status: 'success',
              data: scan.data,
              payload: {
                params: {
                  id: ctx.params.id
                }, query: {}, body: {}
              }
            };
            _process2.default.nextTick(function () {
              scan.startScan();
            });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
routes['/v1/libraries/:id/scans/:scanId'] = {
  get: function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
      var scan;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _models.Scan.findById(ctx.params.scanId);

            case 2:
              scan = _context2.sent;

              if (!(scan.data.libraryId !== ctx.params.id)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', next());

            case 5:
              ctx.status = 200;
              ctx.body = {
                status: 'success',
                data: scan.data,
                payload: {
                  params: {
                    libraryId: ctx.params.id,
                    scanId: ctx.params.scanId
                  }, query: {}
                }
              };

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function get(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }()
};
exports.default = routes;
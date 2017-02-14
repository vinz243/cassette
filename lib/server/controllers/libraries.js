'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Controller = require('./Controller');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _Scan = require('../models/Scan');

var _Library = require('../models/Library');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (0, _merge2.default)({}, (0, _Controller.fetchable)('library', _Library.find, _Library.findById), (0, _Controller.createable)('library', _Library.Library), {
  '/api/v2/libraries/:id/scans': {
    post: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var scan;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                scan = (0, _Scan.Scan)({
                  library: ctx.params.id,
                  statusMessage: 'Pending',
                  statusCode: 'PENDING',
                  dryRun: (ctx.request.fields || ctx.request.body || {}).dryRun || false
                });
                _context.next = 3;
                return scan.create();

              case 3:

                ctx.status = 201;
                ctx.body = scan.props;

                _process2.default.nextTick(function () {
                  scan.startScan();
                });

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function post(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }, '/api/v2/libraries/:id/scans/:scanId': {
    get: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var scan;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                scan = (0, _Scan.findScanById)(ctx.params.scanId);

                if (!(scan.doc.library !== ctx.params.id)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', next());

              case 3:
                ctx.status = 200;
                ctx.body = scan.props;

              case 5:
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
  }
});
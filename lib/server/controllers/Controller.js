'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oneToMany = exports.updateable = exports.removeable = exports.createable = exports.fetchable = undefined;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchable = exports.fetchable = function fetchable(name, find, findById) {
  var _ref3;

  return _ref3 = {}, _defineProperty(_ref3, '/api/v2/' + (0, _pluralize2.default)(name), {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return find(ctx.query);

              case 2:
                res = _context.sent;

                ctx.status = 200;
                ctx.body = res.map(function (el) {
                  return el.props;
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function get(_x) {
        return _ref.apply(this, arguments);
      };
    }()
  }), _defineProperty(_ref3, '/api/v2/' + (0, _pluralize2.default)(name) + '/:id', {
    get: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var doc;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return findById(ctx.params.id);

              case 2:
                doc = _context2.sent;

                if (doc) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', ctx.throw(404, 'Object not found in database'));

              case 5:
                ctx.status = 200;
                ctx.body = doc.props;

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function get(_x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  }), _ref3;
};

var createable = exports.createable = function createable(name, model) {
  return _defineProperty({}, '/api/v2/' + (0, _pluralize2.default)(name), {
    post: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        var object;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                object = model(Object.assign({}, ctx.request.fields || {}, ctx.request.body || {}));

                if (Object.keys(object.props)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return', ctx.throw(400, 'None of the properties provided are acceptable'));

              case 3:
                _context3.next = 5;
                return object.create();

              case 5:
                ctx.status = object.props._id ? 201 : 202;
                ctx.body = object.props;

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function post(_x3) {
        return _ref4.apply(this, arguments);
      };
    }()
  });
};

var removeable = exports.removeable = function removeable(name, findById) {
  return _defineProperty({}, '/api/v2/' + (0, _pluralize2.default)(name) + '/:id', {
    del: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
        var doc;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return findById(ctx.params.id);

              case 2:
                doc = _context4.sent;

                if (doc) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt('return', ctx.throw(404, 'Entity #' + ctx.params.id + ' not found'));

              case 5:
                _context4.next = 7;
                return doc.remove();

              case 7:
                ctx.status = doc.props._id ? 202 : 200;

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      return function del(_x4) {
        return _ref6.apply(this, arguments);
      };
    }()
  });
};

var updateable = exports.updateable = function updateable(name, findById) {
  return _defineProperty({}, '/api/v2/' + (0, _pluralize2.default)(name) + '/:id', {
    put: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
        var doc, props;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return findById(ctx.params.id);

              case 2:
                doc = _context5.sent;

                if (doc) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt('return', ctx.throw(404, 'Entity #' + ctx.params.id + ' not found'));

              case 5:
                props = Object.assign({}, ctx.request.fields || {}, ctx.request.body || {});


                Object.keys(props).forEach(function (key) {
                  doc.set(key, props[key]);
                });

                _context5.next = 9;
                return doc.update();

              case 9:
                ctx.status = 200;
                return _context5.abrupt('return');

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      return function put(_x5) {
        return _ref8.apply(this, arguments);
      };
    }()
  });
};

var oneToMany = exports.oneToMany = function oneToMany(name, childName, findChildren) {
  return _defineProperty({}, '/api/v2/' + (0, _pluralize2.default)(name) + '/:id/' + (0, _pluralize2.default)(childName), {
    get: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ctx) {
        var children;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return findChildren(Object.assign({}, _defineProperty({}, name, ctx.params.id - 0), ctx.query));

              case 2:
                children = _context6.sent;


                ctx.body = children.map(function (child) {
                  return child.props;
                });
                return _context6.abrupt('return');

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      }));

      return function get(_x6) {
        return _ref10.apply(this, arguments);
      };
    }()
  });
};
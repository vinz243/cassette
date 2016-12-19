'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controller = function () {
  function Controller(model) {
    (0, _classCallCheck3.default)(this, Controller);

    this._model = model;
  }

  (0, _createClass3.default)(Controller, [{
    key: 'prefix',
    value: function prefix(_prefix) {
      this._prefix = _prefix;
      return this;
    }
  }, {
    key: 'allowPost',
    value: function allowPost() {
      this._allowPost = true;
      return this;
    }
  }, {
    key: 'allowPut',
    value: function allowPut() {
      this._allowPut = true;
      return this;
    }
  }, {
    key: 'allowDel',
    value: function allowDel() {
      this._allowDel = true;
      return this;
    }
  }, {
    key: 'allowSearches',
    value: function allowSearches() {
      this._allowSearches = true;
      return this;
    }
  }, {
    key: 'done',
    value: function done() {
      var _this = this;

      var self = this,
          routes = {},
          base = '/v1' + (this._prefix || '') + '/' + (0, _pluralize2.default)(this._model.model.name);

      routes[base] = {
        get: function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
            var res;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return self._model.find(ctx.query);

                  case 2:
                    res = _context.sent;

                    ctx.body = {
                      status: 'success',
                      data: res.map(function (d) {
                        return d.data;
                      }),
                      length: res.length,
                      payload: {
                        query: res.query
                      }
                    };

                  case 4:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this);
          }));

          return function get(_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }(),
        post: function () {
          var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
            var doc, payload, _res;

            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    doc = new self._model(ctx.request.fields || ctx.request.body || {});
                    payload = doc.getPayload();
                    _context2.next = 5;
                    return doc.create();

                  case 5:
                    _res = _context2.sent;

                    ctx.status = 201;
                    ctx.body = {
                      status: 'success',
                      data: doc.data,
                      payload: payload
                    };
                    _context2.next = 14;
                    break;

                  case 10:
                    _context2.prev = 10;
                    _context2.t0 = _context2['catch'](0);

                    ctx.status = 500;
                    ctx.body = {
                      status: 'failure',
                      data: {
                        message: _context2.t0.message
                      }
                    };

                  case 14:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this, [[0, 10]]);
          }));

          return function post(_x3, _x4) {
            return _ref2.apply(this, arguments);
          };
        }()
      };

      routes[base + '/searches'] = {
        post: function () {
          var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
            var q, key, val, res;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    q = (0, _lazy2.default)(ctx.request.fields || ctx.request.body || {}).merge(ctx.query || {}).value();


                    for (key in q) {
                      val = q[key];


                      if (val[0] === '/' && val[val.length - 1] === '/') {
                        q[key] = new RegExp(val.slice(1, -1), 'i');
                      }
                    }
                    // cons
                    _context3.next = 4;
                    return self._model.find(q);

                  case 4:
                    res = _context3.sent;


                    ctx.body = {
                      status: 'success',
                      data: res.map(function (d) {
                        return d.data;
                      }),
                      length: res.length,
                      payload: {
                        body: res.query
                      }
                    };
                    ctx.status = 200;

                  case 7:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this);
          }));

          return function post(_x5, _x6) {
            return _ref3.apply(this, arguments);
          };
        }()
      };

      routes[base + '/:id'] = {
        get: function () {
          var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
            var res;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(!ctx.params.id || ctx.params.id === '')) {
                      _context4.next = 2;
                      break;
                    }

                    return _context4.abrupt('return', ctx.redirect(base));

                  case 2:
                    _context4.next = 4;
                    return self._model.findById(ctx.params.id);

                  case 4:
                    res = _context4.sent;


                    if (res) {
                      ctx.body = {
                        status: 'success',
                        data: res.data,
                        payload: {
                          params: {
                            id: ctx.params.id
                          }
                        }
                      };
                    } else {
                      ctx.body = {
                        status: 'failure',
                        payload: {
                          params: {
                            id: ctx.params.id
                          }
                        }
                      };
                      ctx.status = 404;
                    }

                  case 6:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this);
          }));

          return function get(_x7, _x8) {
            return _ref4.apply(this, arguments);
          };
        }()
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this._model.model.relations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rel = _step.value;

          if (rel.type === 'oneToMany') {
            (function () {
              var m = 'get' + (0, _pascalCase2.default)((0, _pluralize2.default)(rel.model.model.name));
              var path = base + '/:id/' + (0, _pluralize2.default)(rel.model.model.name);
              routes[path] = {
                get: function () {
                  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
                    var doc, res;
                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return self._model.findById(ctx.params.id);

                          case 2:
                            doc = _context5.sent;

                            if (doc) {
                              _context5.next = 7;
                              break;
                            }

                            ctx.body = {
                              status: 'failed',
                              data: {
                                error_message: 'Document not found',
                                error_code: 'ENOTFOUND'
                              },
                              payload: {
                                query: res.query
                              }
                            };

                            ctx.status = 404;
                            return _context5.abrupt('return');

                          case 7:
                            _context5.next = 9;
                            return doc[m](ctx.query);

                          case 9:
                            res = _context5.sent;

                            ctx.body = {
                              status: 'success',
                              data: res.map(function (d) {
                                return d.data;
                              }),
                              length: res.length,
                              payload: {
                                query: res.query
                              }
                            };

                          case 11:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this);
                  }));

                  return function get(_x9, _x10) {
                    return _ref5.apply(this, arguments);
                  };
                }()
              };
            })();
          }
        }

        // for (let index in this._model.fields) {
        //   let field = this._model.fields[index];
        //   if (field.type === 'oneToMany') {
        //     routes[base + '/:id/' + pluralize(field.name)] = {
        //       get: async (ctx, next) => {
        //         let res = await self.
        //       }
        //     }
        //   }
        //
        // }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return routes;
    }
  }]);
  return Controller;
}();

var _default = Controller;
exports.default = _default;
;

(function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Controller, 'Controller', 'src/server/controllers/Controller.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/server/controllers/Controller.js');
})();

;
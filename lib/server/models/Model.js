'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nedbPromise = require('nedb-promise');

var _nedbPromise2 = _interopRequireDefault(_nedbPromise);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _config3 = require('./config.js');

var _config4 = _interopRequireDefault(_config3);

var _storyboard = require('storyboard');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lazy = require('lazy.js');

var _lazy2 = _interopRequireDefault(_lazy);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _snakeCase = require('snake-case');

var _snakeCase2 = _interopRequireDefault(_snakeCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataDir = _path2.default.join(_config2.default.get('configPath'), '/data/');
_mkdirp2.default.sync(dataDir);

var ModelField = function () {
  function ModelField(name, model) {
    _classCallCheck(this, ModelField);

    this.name = name;
    this.model = model;
  }

  _createClass(ModelField, [{
    key: 'int',
    value: function int() {
      this.type = 'int';
      this.validator = function (data) {
        var value = data;
        if (data === parseInt(data, 10)) {
          return true;
        }
        return false;
      };
      return this;
    }
  }, {
    key: 'defaultParam',
    value: function defaultParam() {
      this._default = true;
      this.model._default = this.name;
      return this;
    }
  }, {
    key: 'defaultValue',
    value: function defaultValue(val) {
      this._defaultValue = val;
      return this;
    }
  }, {
    key: 'float',
    value: function float() {
      this.type = 'float';
      this.validator = function (n) {
        return Number(n) === n;
      };
      return this;
    }
  }, {
    key: 'string',
    value: function string() {
      this.type = 'string';
      this.validator = function (data) {
        return typeof data === 'string';
      };
      return this;
    }
  }, {
    key: 'boolean',
    value: function boolean() {
      this.type = 'boolean';
      this.validator = function (data) {
        return typeof data === 'boolean';
      };
      return this;
    }
  }, {
    key: 'oneToOne',
    value: function oneToOne() {
      this.type = 'oneToOne';
      this.validator = function (data) {
        return typeof data === 'string';
      };
      return this;
    }
  }, {
    key: 'any',
    value: function any() {
      this.type = 'any';
      this.validator = function (data) {
        return true;
      };
      return this;
    }
  }, {
    key: 'regex',
    value: function regex(reg) {
      if (this.type !== 'string') throw new Error('Using regex on a non-string field');
      return this;
    }
  }, {
    key: 'required',
    value: function required() {
      this._required = true;
      return this;
    }
  }, {
    key: 'notIdentity',
    value: function notIdentity() {
      this._notIdentity = true;
      return this;
    }
  }, {
    key: 'done',
    value: function done() {
      return this.model;
    }
  }]);

  return ModelField;
}();

var databases = {};

var Model = function () {
  function Model(name) {
    _classCallCheck(this, Model);

    this.name = name;
    this.dbName = (0, _snakeCase2.default)(name) + 's';
    this.dbPath = _path2.default.join(dataDir, this.dbName + '.db');
    this.fields = [];
    this.relations = [];
    this.methods = [];

    this.emitter = new _events2.default.EventEmitter();

    this.field('_id').string();
  }

  _createClass(Model, [{
    key: 'field',
    value: function field(name) {
      var field = new ModelField(name, this);
      this.fields.push(field);
      return field;
    }
  }, {
    key: 'oneToMany',
    value: function oneToMany(manyModel, fieldName) {
      (0, _assert2.default)(manyModel !== undefined);
      (0, _assert2.default)(manyModel !== {});
      this.relations.push({
        model: manyModel,
        fieldName: fieldName,
        type: 'oneToMany'
      });
      return this;
    }
  }, {
    key: 'noDuplicates',
    value: function noDuplicates() {
      this._noDuplicates = true;
      return this;
    }
  }, {
    key: 'acceptsEmptyQuery',
    value: function acceptsEmptyQuery() {
      this.acceptsEmptyQuery = true;
      return this;
    }
  }, {
    key: 'implement',
    value: function implement(funcName, func) {
      this.methods.push({
        name: funcName,
        callback: func
      });
      return this;
    }
  }, {
    key: 'hook',
    value: function hook(evt, callback) {
      this.emitter.on(evt, callback);
      return this;
    }
  }, {
    key: 'done',
    value: function done() {
      var db = undefined,
          self = this;
      self.emitter.emit('done:before');

      if (databases[self.dbPath]) {
        _storyboard.mainStory.warn('db', 'Not loading DB again..');
        db = databases[self.dbPath];
      } else {
        db = new _nedbPromise2.default(self.dbPath);
        db.loadDatabase();
        databases[self.dbPath] = db;
      }

      var model = function model(d) {
        self.emitter.emit('construct:before', this);
        d = d || {};
        if (typeof d === 'string') {
          if (self._default) {
            var val = d;
            d = {};
            d[self._default] = val;
          } else {
            throw new Error('Cannot accept a string as an object');
          }
        }
        this.data = {};
        // let data = Lazy(d).pick(this.fields.map(f => f.name));
        for (var index in self.fields) {
          var field = self.fields[index];
          var value = d[field.name];
          this.data[field.name] = value || field._defaultValue;
        }
        this._id = this.data._id;
        self.emitter.emit('construct:after', this);
      };

      // We add the custom functions
      for (var index in self.methods) {
        var method = self.methods[index];
        model.prototype[method.name] = method.callback;
      }

      model.model = self;
      model.prototype.getPayload = function () {
        self.emitter.emit('getPayload:before', this);
        var payload = {};

        for (var _index in self.fields) {
          var field = self.fields[_index];
          var value = this.data[field.name];

          if (typeof value === 'undefined' && field._required) throw new Error('Field ' + field.name + ' is required');

          if (field.validator && !field.validator(value)) {
            if (field._required) throw new Error('Field ' + field.name + ' is required but has invalid value');else _storyboard.mainStory.info('db', 'Dropping field ' + field.name + ' with ' + value);
          } else {
            payload[field.name] = value;
          }
        }
        self.emitter.emit('getPayload:after', this);
        return payload;
      };

      model.prototype.create = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var q, _res, res;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                self.emitter.emit('create:before', this);

                if (!(this._id || this.data._id)) {
                  _context.next = 3;
                  break;
                }

                throw new Error('Object is already from database');

              case 3:
                if (!self._noDuplicates) {
                  _context.next = 13;
                  break;
                }

                if (self._default) {
                  _context.next = 6;
                  break;
                }

                throw new Error('No dups specified but no default field');

              case 6:
                q = {};

                q[self._default] = this.data[self._default];
                _context.next = 10;
                return db.find(q);

              case 10:
                _res = _context.sent;

                if (!(_res.length > 0)) {
                  _context.next = 13;
                  break;
                }

                throw new Error('Entry is already existing and dups found');

              case 13:
                _context.next = 15;
                return db.insert(this.getPayload());

              case 15:
                res = _context.sent;

                _storyboard.mainStory.debug('db', 'created ' + self.name + '#' + this._id);

                this._id = this.data._id = res._id;
                self.emitter.emit('create:after', this);

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      model.prototype.set = function (key, value) {
        if (key === '_id') {
          throw new Error('Cannot set _id');
        }
        this.data[key] = value;
      };

      model.prototype.update = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key, value) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  self.emitter.emit('update:before', this);

                  if (this._id) {
                    _context2.next = 3;
                    break;
                  }

                  throw new Error('Cannot update ghost model');

                case 3:
                  _context2.next = 5;
                  return db.update({ _id: this._id }, this.getPayload());

                case 5:
                  self.emitter.emit('update:after', this);
                  _storyboard.mainStory.debug('db', 'updated ' + self.name + '#' + this._id);
                  return _context2.abrupt('return');

                case 8:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }();

      model.findById = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return model.find({ _id: id, limit: 1 });

                case 2:
                  return _context3.abrupt('return', _context3.sent[0]);

                case 3:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }();

      model.find = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(query, forceEmpty) {
          var q, opts, sort, res;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  q = (0, _lazy2.default)(query).omit(self.fields.filter(function (f) {
                    return f.notIdentity;
                  })).pick(self.fields.map(function (f) {
                    return f.name;
                  })).value();

                  // if (Object.keys(q).length  == 0 && !self.acceptsEmptyQuery
                  //   && !forceEmpty) {
                  //   throw new Error('Empty or invalid query');
                  // }

                  opts = (0, _lazy2.default)(query).pick(['limit', 'offset', 'sort', 'direction']).value();


                  if (!opts.limit || opts.limit > 500 || opts.limit < 1) {
                    opts.limit = 500;
                  }

                  sort = {};

                  sort[opts.sort || 'name'] = opts.direction ? opts.direction == 'asc' ? 1 : -1 : 1;

                  _context4.next = 7;
                  return db.cfind(q).sort(sort).limit(opts.limit).skip(opts.skip || 0).exec();

                case 7:
                  _context4.t0 = function (d) {
                    return new model(d);
                  };

                  res = _context4.sent.map(_context4.t0);


                  res.query = (0, _lazy2.default)(q).merge(opts).value();
                  return _context4.abrupt('return', res);

                case 11:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        return function (_x4, _x5) {
          return _ref4.apply(this, arguments);
        };
      }();
      // for (let i in this.fields.filter(t => t.type == 'oneToOne')) {
      //   let field = this.fields[i];
      //   model.prototype['get' + pascalCase(field.name)] = {
      //
      //   }
      // }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var rel = _step.value;


          if (rel.type === 'oneToMany') {
            (function () {
              var m = 'get' + (0, _pascalCase2.default)((0, _pluralize2.default)(rel.model.model.name));
              model.prototype[m] = function (query) {
                self.emitter.emit(m + ':before', this);
                query = query || {};
                if (!this._id) {
                  throw new Error('Can\'t get children of unserialized object');
                }
                query[rel.fieldName] = this._id;
                self.emitter.emit(m + ':after', this);
                return rel.model.find(query);
              };
            })();
          }
        };

        for (var _iterator = this.relations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
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

      return model;
    }
  }]);

  return Model;
}();

// Chaining example:
//
// (new Model('MyModel'))
//   .field('itemName')
//     .required()
//     .string()
//     .regex(/Regex/)
//     .done()
//   .field('itemCategory')
//     .float()
//     .notIdentity() <-- means won't be accepted as a query
//     .done()
//   .done()

exports.default = Model;
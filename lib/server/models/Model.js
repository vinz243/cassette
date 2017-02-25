'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeable = exports.createable = exports.updateable = exports.legacySupport = exports.manyToOne = exports.publicProps = exports.databaseLoader = exports.findOneFactory = exports.defaultFunctions = exports.assignFunctions = exports.findFactory = exports.findOrCreateFactory = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _storyboard = require('storyboard');

var _tingodb = require('tingodb');

var _tingodb2 = _interopRequireDefault(_tingodb);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _assignWith = require('lodash/assignWith');

var _assignWith2 = _interopRequireDefault(_assignWith);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dataDir = _path2.default.join(_config2.default.get('configPath'), '/database/');
_mkdirp2.default.sync(dataDir);

var databases = {};
var db = new ((0, _tingodb2.default)({
  nativeObjectID: false
}).Db)(dataDir, {});

// This function returns the nedb datastore corresponding to a name
// Useful for manyToOne. if it wasn't found it will create it
var getDatabase = function getDatabase(name) {
  var database = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : db;

  if (databases[name]) {
    return databases[name];
  }
  databases[name] = database.collection((0, _pluralize2.default)(name));
  return getDatabase(name, database);
};

var findOrCreateFactory = exports.findOrCreateFactory = function findOrCreateFactory(model) {
  return function (query) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var obj = model(query);
    return obj.populate().then(function () {
      if (obj.props._id) {
        return Promise.resolve(obj);
      }
      var newObj = model(Object.assign({}, query, props));
      return newObj.create().then(function () {
        return Promise.resolve(newObj);
      });
    }).then(function (object) {
      return Promise.resolve(object);
    });
  };
};

var findFactory = exports.findFactory = function findFactory(model, name) {
  var getDB = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getDatabase;

  return function (query) {
    return new Promise(function (resolve, reject) {
      var optFields = ['limit', 'sort', 'skip', 'direction'];
      var opts = (0, _pick2.default)(query, optFields);

      if (!opts.limit || opts.limit > 500 || opts.limit < 1) {
        opts.limit = 500;
      }

      var sort = {};
      sort[opts.sort || 'name'] = opts.direction ? opts.direction == 'asc' ? 1 : -1 : 1;
      var res = getDatabase(name).find(Object.assign({}, (0, _omit2.default)(query, optFields), query._id ? {
        _id: query._id - 0
      } : {})).sort(sort).limit(opts.limit).skip(opts.skip || 0).toArray(function (err, docs) {
        if (err) return reject(err);

        var models = docs.map(function (el) {
          return model({ _id: el._id });
        });

        Promise.all(models.map(function (el) {
          return el.populate();
        })).then(function () {
          resolve(models);
        });
      });
    });
  };
};

// useful for defaults
var notImplemented = function notImplemented(name) {
  return function () {
    throw new _boom2.default.create(500, 'Function ' + name + ' isn\'t implemented yet');
  };
};

// This function is a customized version of _.assign
// use this in models for composition !!!
var assignFunctions = exports.assignFunctions = function assignFunctions(obj) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  return _assignWith2.default.apply(undefined, [obj].concat(sources, [function (objValue, srcValue, key, object, source) {
    var descriptor = Object.getOwnPropertyDescriptor(source, key);
    // if this is a post hook, we will want to stack those methods
    // a bit like middlewares. This allows things like postPopulate
    // for populating all childs with several manyToOne.
    if (key.startsWith('post')) {
      var method = key.slice(4)[0].toLowerCase() + key.slice(5);
      object[method] = function (fun) {
        return function () {
          var res = fun.apply(undefined, arguments);
          // If the result is a promise we wait and call next after that
          if (res && res.then) {
            return res.then(srcValue);
          } else {
            return srcValue(res);
          }
        };
      }(object[method]);
    } else if (key.startsWith('pre')) {} else if (descriptor.get) {
      object.__defineGetter__(key, function () {
        return source[key];
      });
      return;
    } else {
      // if this is not a post/pre, then just do as we're supposed to
      return srcValue ? srcValue : objValue;
    }
  }]));
};

// This function returns a composite object with the default values.
// Any composition should use that otherwise their might be some problem
// like undefined is not a function
var defaultFunctions = exports.defaultFunctions = function defaultFunctions(state) {
  return Object.assign.apply({}, ['update', 'set', 'create', 'remove', 'populate'].map(function (method) {
    return _defineProperty({}, method, notImplemented(method));
  }));
};

// call this function with a model factory to get a function that will
// return a promise, which when fulfilled, returns the object wuth matching props
// (unless _id is provided, then it only find by _id)
var findOneFactory = exports.findOneFactory = function findOneFactory(model) {
  return function (props) {
    var obj = model(Object.assign({}, props, props._id ? {
      _id: props._id - 0
    } : {}));
    return obj.populate().then(function () {
      if (!obj.props._id) return Promise.resolve();
      return Promise.resolve(obj);
    });
  };
};

// Composite that allows loading an object from the database
// This is done by using populate. So to find an object in the db
// create a object with the query, then populate. See findOneFactory
var databaseLoader = exports.databaseLoader = function databaseLoader(state) {
  var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDatabase(state.name);
  return {
    populate: function populate() {
      var query = state.props._id ? {
        _id: state.props._id - 0
      } : Object.assign({}, state.props);
      return new Promise(function (resolve, reject) {
        db.findOne(query, {}, function (err, doc) {
          if (err) return reject(err);
          state.props = Object.assign({}, doc || {});
          resolve();
        });
      });
    }
  };
};

var publicProps = exports.publicProps = function publicProps(state) {
  return {
    getProps: function getProps() {
      return Object.assign({}, state.props);
    },
    get doc() {
      return Object.assign({}, state.props);
    },
    get props() {
      return Object.assign({}, state.functions.getProps());
    }
  };
};

// This creates acomposite object that populates field `name` with
// the child props. This is a hook.
var manyToOne = function manyToOne(state, name) {
  var getDB = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getDatabase;
  return {
    postGetProps: function postGetProps(_ref2) {
      var parentId = _ref2[name],
          props = _objectWithoutProperties(_ref2, [name]);

      var pop = state.populated[name];
      return Object.assign({}, props, pop && Object.keys(pop).length > 0 ? _defineProperty({}, name, pop) : parentId ? _defineProperty({}, name, parentId) : {});
    },
    postPopulate: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  if (!state.props[name]) return resolve();
                  getDB(name).findOne({
                    _id: state.props[name]
                  }, {}, function (err, doc) {
                    if (err) return reject(err);
                    state.populated[name] = doc;
                    resolve();
                  });
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function postPopulate() {
        return _ref5.apply(this, arguments);
      };
    }()
  };
};

// Enables legacy support, the old model.data field
exports.manyToOne = manyToOne;
var legacySupport = exports.legacySupport = function legacySupport(state) {
  return {
    get data() {
      return state.functions.getProps();
    }
  };
};

// Composite to allow updating a document
var updateable = exports.updateable = function updateable(state) {
  var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDatabase(state.name);
  return {
    update: function update() {
      if (!state.dirty) {
        _storyboard.mainStory.info('db', 'Trying to update a non dirty document');
        return;
      }
      return new Promise(function (resolve, reject) {
        db.update({ _id: state.props._id }, state.props, function (err) {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    set: function set(key, value) {
      if (state.fields.includes(key)) {
        state.props = Object.assign({}, state.props, _defineProperty({}, key, value));
        state.dirty = true;
      }
    }
  };
};

// (recommended) composite to allow the creation of a document
var createable = exports.createable = function createable(state) {
  var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDatabase(state.name);
  return {
    create: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!state.props._id) {
                  _context2.next = 2;
                  break;
                }

                throw _boom2.default.create('Cannot create a document that already exists');

              case 2:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  db.insert(state.props, function (err, _ref7) {
                    var _ref8 = _slicedToArray(_ref7, 1),
                        props = _ref8[0];

                    if (err) return reject(_boom2.default.wrap(err));
                    state.props = Object.assign({}, props);
                    resolve();
                  });
                }));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function create() {
        return _ref6.apply(this, arguments);
      };
    }()
  };
};

var removeable = exports.removeable = function removeable(state) {
  var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDatabase(state.name);
  return {
    remove: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!state.props._id) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                  db.remove({ _id: state.props._id }, {}, function (err) {
                    if (err) return reject(err);
                    delete state.props._id;
                    resolve();
                  });
                }));

              case 2:
                return _context3.abrupt('return');

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      return function remove() {
        return _ref9.apply(this, arguments);
      };
    }()
  };
};
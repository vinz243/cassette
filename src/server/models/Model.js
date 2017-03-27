const conf = require("../config.js");
const {mainStory} = require('storyboard');
const tingodb = require("tingodb");
const assert = require("assert");

const events = require("events");
const mkdirp = require("mkdirp");
const path = require("path");
const Boom = require("boom");
const assignWith = require("lodash/assignWith");
const pick = require("lodash/pick");
const omit = require("lodash/omit");

const pluralize = require("pluralize");

let dataDir = path.join(conf.get('configPath'), '/database/');
mkdirp.sync(dataDir);

let databases = {};
let db = new (tingodb({
  nativeObjectID: false
}).Db)(dataDir, {});

// This function returns the nedb datastore corresponding to a name
// Useful for manyToOne. if it wasn't found it will create it
const getDatabase = (name, database = db) => {
  if (databases[name]) {
    return databases[name];
  }
  databases[name] = database.collection(pluralize(name));
  return getDatabase(name, database);
}

const findOrCreateFactory = module.exports.findOrCreateFactory = (model) => {
  return (query, props = {}) => {

    let obj = model(query);
    return obj.populate().then(() => {
      if (obj.props._id) {
        return Promise.resolve(obj);
      }
      let newObj = model(Object.assign({}, query, props));
      return newObj.create().then(() => Promise.resolve(newObj));
    }).then((object) => {
      return Promise.resolve(object);
    });
  }
}

const findFactory = module.exports.findFactory = (model, name, getDB = getDatabase) => {
  return (query) => {
    return new Promise((resolve, reject) => {
      let optFields = ['limit', 'sort', 'skip', 'direction']
      let opts = pick(query, optFields);

      if (!opts.limit || opts.limit > 500 || opts.limit < 1) {
        opts.limit = 500;
      }

      let sort = {};
      sort[opts.sort || 'name'] = opts.direction ?
        (opts.direction == 'asc' ? 1 : -1) : 1;
      let res = getDatabase(name)
        .find(Object.assign({}, omit(query, optFields), query._id ? {
          _id: query._id - 0
        } : {}))
        .sort(sort)
        .limit(opts.limit)
        .skip(opts.skip || 0)
        .toArray((err, docs) => {
          if (err) return reject(err);

          let models = docs.map((el) => model({_id: el._id}));

          Promise.all(models.map(el => el.populate())).then(() => {
            resolve(models);
          });
        });
    });
  }
}

// useful for defaults
const notImplemented = (name) => {
  return function () {
    throw new Boom.create(500, `Function ${name} isn't implemented yet`);
  }
}

// This function is a customized version of _.assign
// use this in models for composition !!!
const assignFunctions = module.exports.assignFunctions = (obj, ...sources) => {
  return assignWith(obj, ...sources,
    (objValue, srcValue, key, object, source) => {
    let descriptor = Object.getOwnPropertyDescriptor(source, key);
    // if this is a post hook, we will want to stack those methods
    // a bit like middlewares. This allows things like postPopulate
    // for populating all childs with several manyToOne.
    if (key.startsWith('post')) {
      const method = key[4].toLowerCase() + key.slice(5);
      object[method] = (function (fun) {
        return (...args) => {
          let res = fun(...args);
          // If the result is a promise we wait and call next after that
          if (res && res.then) {
            return res.then(srcValue);
          } else {
            return srcValue(res);
          }
        }
      })(object[method]);
    // This is a pre-hook. While post-hook can mutate the result of the core
    // function, pre-hook can mutates its arguments. Useful for defaults.
    } else if (key.startsWith('pre')) {
      const method = key[3].toLowerCase() + key.slice(4);
      object[method] = (function (fun) {
        return (...args) => {
          let res = srcValue(...args) || args;
          if (res && res.then) {
            return res.then((transformedArgs) => {
              if (!transformedArgs.length) {
                // Pre-hook resolved undefined, then we call source
                // With original args
                return fun(...args);
              }
              return fun(...transformedArgs);
            });
          } else {
            if (res.length) {
              return fun(...res);
            } else {
              return fun(...args);
            }
          }
        }
      })(object[method]);

    } else if (descriptor.get) {
      object.__defineGetter__(key, () => source[key]);
      return;
    } else {
      // if this is not a post/pre, then just do as we're supposed to
      return srcValue ? srcValue : objValue;
    }
  })
}

// This function returns a composite object with the default values.
// Any composition should use that otherwise their might be some problem
// like undefined is not a function
const defaultFunctions = module.exports.defaultFunctions = (state) => {
  return Object.assign.apply({},
    ['update', 'set', 'create', 'remove', 'populate'].map((method) => ({
      [method]: notImplemented(method)
    }))
  );
}

// call this function with a model factory to get a function that will
// return a promise, which when fulfilled, returns the object wuth matching props
// (unless _id is provided, then it only find by _id)
const findOneFactory = module.exports.findOneFactory = (model) => {
  return (props) => {
    let obj = model(Object.assign({}, props, props._id ? {
      _id: props._id - 0
    } : {}));
    return obj.populate().then(() => {
      if (!obj.props._id)
        return Promise.resolve();
      return Promise.resolve(obj)
    });
  }
}

// Composite that allows loading an object from the database
// This is done by using populate. So to find an object in the db
// create a object with the query, then populate. See findOneFactory
const databaseLoader = module.exports.databaseLoader =  (state, db = getDatabase(state.name)) => ({
  populate: () => {
    let query = state.props._id ? {
      _id: state.props._id - 0
    } : Object.assign({}, state.props);
    return new Promise((resolve, reject) => {
      db.findOne(query, {}, (err, doc) => {
        if (err) return reject(err);
        state.props = Object.assign({}, doc || {});
        resolve();
      });
    });
  }
});

const publicProps = module.exports.publicProps = (state) => ({
  getProps:() => {
    return Object.assign({}, state.props);
  },
  get doc () {
    return Object.assign({}, state.props);
  },
  get props() {
    return Object.assign({}, state.functions.getProps());
  }
});

// This creates acomposite object that populates field `name` with
// the child props. This is a hook.
const manyToOne = module.exports.manyToOne = (state, name, getDB = getDatabase) => ({
  postGetProps: (props) => {
    const parentId = props[name];
    const pop      = state.populated[name];
    return Object.assign({}, props, (pop && Object.keys(pop).length) ? {
      [name]: pop
    } : {});
  },
  postPopulate: async () => {
    return new Promise((resolve, reject) => {
      if (!state.props[name]) return resolve();
      getDB(name).findOne({
        _id: state.props[name]
      }, {}, (err, doc) => {
        if (err) return reject(err);
        state.populated[name] = doc;
        resolve();
      });
    });
  }
})

// Enables legacy support, the old model.data field
const legacySupport = module.exports.legacySupport = (state) => ({
  get data() {
    return state.functions.getProps();
  }
});

// Composite to allow updating a document
const updateable = module.exports.updateable = (state, db = getDatabase(state.name)) => ({
  update: () => {
    if (!state.dirty) {
      mainStory.info('db', 'Trying to update a non dirty document');
      return;
    }
    return new Promise((resolve, reject) => {
      db.update({_id: state.props._id}, state.props, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
  set: (key, value) => {
    if (state.fields.includes(key)) {
      state.props = Object.assign({}, state.props, {[key]: value});
      state.dirty = true;
    }
  }
});

// (recommended) composite to allow the creation of a document
const createable = module.exports.createable = (state, db = getDatabase(state.name)) => ({
  create: async () => {
    if (state.props._id) {
      throw Boom.create('Cannot create a document that already exists');
    }
    return new Promise((resolve, reject) => {
       db.insert(state.props, (err, [props]) => {
        if (err)
          return reject(Boom.wrap(err));
        state.props = Object.assign({}, props);
        resolve();
      });
    });
  }
});

const removeable = module.exports.removeable = (state, db = getDatabase(state.name)) => ({
  remove: async () => {
    if (state.props._id) {
      return new Promise((resolve, reject) => {
        db.remove({_id: state.props._id}, {}, (err) => {
          if (err) return reject(err);
          delete state.props._id;
          resolve();
        });
      });
    }
    return;
  }
})


const defaultValues = module.exports.defaultValues = (state, mutators) => {
  const hook = function () {
    Object.keys(mutators).forEach((name) => {
      const mutator = mutators[name];
      const prop = state.props[name];
      if (!prop && !['boolean', 'number'].includes(typeof prop)) {
        if (typeof mutator === 'function') {
          state.props[name] = mutator();
        } else {
          state.props[name] = mutator;
        }
      }
    });
  };
  return {
    preUpdate: hook,
    preCreate: hook
  };
}

export const validator = (state, ...validators) => {
  const val = Object.assign({}, ...validators);
  const hook = function () {
    Object.keys(val).forEach((key) => {
      let validators = [].concat(val[key]);
      const values = validators.map(validate => validate(state.props[key]));
      const [value] = values.slice(-1);
      state.props[key] = value;
    });
  };

  return {
    preUpdate: hook,
    preCreate: hook
  };
}

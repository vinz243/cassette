import Datastore from 'nedb-promise';
import conf from '../config.js';
import config from './config.js';
import { mainStory } from 'storyboard';

import assert from 'assert';
import events from 'events';
import mkdirp from 'mkdirp';
import path from 'path';
import Boom from 'boom';
import assignWith from 'lodash/assignWith';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import pascalCase from 'pascal-case';
import pluralize from 'pluralize';
import snakeCase from 'snake-case';

let dataDir = path.join(conf.get('configPath'), '/data/');
mkdirp.sync(dataDir);

let databases = {};

// This function returns the nedb datastore corresponding to a name
// Useful for manyToOne. if it wasn't found it will create it
const getDatabase = (name, Store = Datastore) => {
  let dbName = pluralize(name);
  let dbPath = path.join(dataDir, dbName + '.db');
  if (databases[dbName]) {
    return databases[dbName];
  }
  databases[dbName] = new Store({
    filename: dbPath
  });
  databases[dbName].loadDatabase();
  return getDatabase(name, Store);
}

export const findFactory = (model, name, getDB = getDatabase) => {
  return async (query) => {
    let optFields = ['limit', 'sort', 'skip', 'direction']
    let opts = pick(query, optFields);

    if (!opts.limit || opts.limit > 500 || opts.limit < 1) {
      opts.limit = 500;
    }

    let sort = {};
    sort[opts.sort || 'name'] = opts.direction ?
      (opts.direction == 'asc' ? 1 : -1) : 1;

    let res = (await getDatabase(name)
      .cfind(omit(query))
      .sort(sort)
      .limit(opts.limit)
      .skip(opts.skip || 0)
      .exec());

    let models = res.map((el) => model({_id: el._id}));

    await Promise.all(models.map(el => el.populate()));
    return models;
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
export const assignFunctions = (obj, ...sources) => {
  return assignWith(obj, ...sources,
    (objValue, srcValue, key, object, source) => {
    let descriptor = Object.getOwnPropertyDescriptor(source, key);
    // if this is a post hook, we will want to stack those methods
    // a bit like middlewares. This allows things like postPopulate
    // for populating all childs with several manyToOne.
    if (key.startsWith('post')) {
      const method = key.slice(4)[0].toLowerCase() + key.slice(5);
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
      })(object[method])
    } else if (key.startsWith('pre')) {

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
export const defaultFunctions = (state) => {
  return Object.assign.apply({},
    ['update', 'set', 'create', 'remove', 'populate'].map((method) => ({
      [method]: notImplemented(method)
    }))
  );
}

// call this function with a model factory to get a function that will
// return a promise, which when fulfilled, returns the object wuth matching props
// (unless _id is provided, then it only find by _id)
export const findOneFactory = (model) => {
  return (props) => {
    let obj = model(props);
    return obj.populate().then(() => Promise.resolve(obj));
  }
}

// Composite that allows loading an object from the database
// This is done by using populate. So to find an object in the db
// create a object with the query, then populate. See findOneFactory
export const databaseLoader =  (state, db = getDatabase(state.name)) => ({
  populate: async () => {
    state.props = Object.assign({}, await db.findOne(state.props._id ? {
      _id: state.props._id
    } : state.props));
  }
});

export const publicProps = (state) => ({
  getProps:() => {
    return Object.assign({}, state.props);
  },
  get props() {
    return state.functions.getProps();
  }
});

// This creates acomposite object that populates field `name` with
// the child props. This is a hook.
export const manyToOne = (state, name, getDB = getDatabase) => ({
  postGetProps: ({[name + 'Id']: omit, ...props}) => {
    return Object.assign({}, props, {
      [name]: state.populated[name]
    });
  },
  postPopulate: async () => {
    state.populated[name] = await getDB(name).find({
      _id: state.props[name + 'Id']
    });
  }
})

// Enables legacy support, the old model.data field
export const legacySupport = (state) => ({
  get data() {
    return state.functions.getProps();
  }
});

// Composite to allow updating a document
export const updateable = (state, db = getDatabase(state.name)) => ({
  update: async () => {
    if (!state.dirty) {
      mainStory.info('db', 'Trying to update a non dirty document');
      return;
    }
    try {
      let res = await db.update({_id: state.props._id}, state.props);
      return;
    } catch (err) {
      throw Boom.wrap(err);
    }
  },
  set: (key, value) => {
    if (state.fields.includes(key)) {
      state.props = Object.assign({}, state.props, {[key]: value});
    }
  }
});

// (recommended) composite to allow the creation of a document
export const createable =  (state, db = getDatabase(state.name)) => ({
  create: async () => {
    try {
      state.props = await db.insert(state.props);
    } catch (err) {
      throw Boom.wrap(err);
    }
  }
})

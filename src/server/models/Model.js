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

import pascalCase from 'pascal-case';
import pluralize from 'pluralize';
import snakeCase from 'snake-case';

let dataDir = path.join(conf.get('configPath'), '/data/');
mkdirp.sync(dataDir);

let databases = {};
// this.dbPath = path.join(dataDir, this.dbName + '.db');

// type State = {
//   db: any,
//   dirty: boolean,
//   props: any,
//   fields: string[]
// }

// useful for defaults
const notImplemented = (name) => {
  return function () {
    throw new Boom.create(500, `Function ${name} isn't implemented yet`);
  }
}

// export const baseModel = (props) => {
//   let state: State = {
//     db: {},
//     dirty: false,
//     fields: Array.isArray(fields) ? fields : Object.keys(props),
//     _props: props
//   }
//   let defaultFunctions =
// };


// This function is a customized version of _.assign
// use this in models for composition !!!
export const assignFunctions = (obj, ...sources) => {
  return assignWith(obj, ...sources,
    (objValue, srcValue, key, object, source) => {

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
  return Object.assign({}, Object.assign.apply({},
    ['update', 'set', 'create', 'remove'].map((method) => ({
      [method]: notImplemented(method)
    }))
  ), {
    getProps() {
      return Object.assign({}, state._props);
    }
  }, {
    populate: async () => {
      state._props = Object.assign({}, await state.db.findOne({
        _id: state._props._id
      }));
    }
  });
}

// This function returns the nedb corresponding to a name
// Useful for manyToOne
export const getDatabase = (name) => {

}

// This creates acomposite object that populates field `name` with
// the child props. This is a hook.
export const manyToOne = (state, name) => ({
  postGetProps: ({[name + 'Id']: omit, ...props}) => {
    return Object.assign({}, props, {
      [name]: state.populated[name]
    });
  },
  postPopulate: async () => {
    state.populated[name] = await state.db.find({
      _id: state._props[name + 'Id']
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
export const updateable = (state) => ({
  update: async () => {
    if (!state.dirty) {
      mainStory.info('db', 'Trying to update a non dirty document');
      return;
    }
    try {
      let res = await state.db.update({_id: state._props._id}, state._props);
      return;
    } catch (err) {
      throw Boom.wrap(err);
    }
  },
  set: (key, value) => {
    if (state.fields.includes(key)) {
      state._props = Object.assign({}, state._props, {[key]: value});
    }
  }
});

// (recommended) composite to allow the creation of a document
export const createable = (state) => ({
  create: async () => {
    try {
      return await db.insert(state._props);
    } catch (err) {
      throw Boom.wrap(err);
    }
  }
})

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

export const assignFunctions = (obj, ...sources) => {
  return assignWith(obj, ...sources,
    (objValue, srcValue, key, object, source) => {
    if (key.startsWith('post')) {
      const method = key.slice(4)[0].toLowerCase() + key.slice(5);
      object[method] = (function (fun) {
        return (...args) => {
          let res = fun(...args);
          if (res && res.then) {
            return res.then(srcValue);
          } else {
            return srcValue(res);
          }
        }
      })(object[method])
    } else if (key.startsWith('pre')) {

    } else {
      return srcValue ? srcValue : objValue;
    }
  })
}

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
export const getDatabase = (name) => {

}
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

export const legacySupport = (state) => ({
  get data() {
    return state.functions.getProps();
  }
});

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

export const creatable = (state) => ({
  create: async () => {
    try {
      return await db.insert(state._props);
    } catch (err) {
      throw Boom.wrap(err);
    }
  }
})

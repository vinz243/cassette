import Datastore from 'nedb-promise';
import conf from '../config.js';
import config from './config.js';

import assert from 'assert';
import events from 'events';
import mkdirp from 'mkdirp';
import path from 'path';
import Lazy from 'lazy.js';

import pascalCase from 'pascal-case';
import pluralize from 'pluralize';
import snakeCase from 'snake-case';

let dataDir = path.join(conf.get('configPath'), '/data/');
mkdirp.sync(dataDir);

class ModelField {
  constructor(name, model) {
    this.name = name;
    this.model = model;
  }
  int() {
    this.type = 'int';
    this.validator = (data) => {
      let value = data;
      if (data === parseInt(data, 10)) {
        return true;
      }
      return false;
    }
    return this;
  }
  defaultParam () {
    this._default = true;
    this.model._default = this.name;
    return this;
  }
  defaultValue(val) {
    this._defaultValue = val;
    return this;
  }
  float() {
    this.type = 'float';
    this.validator = (n) => Number(n) === n;
    return this;
  }
  string() {
    this.type = 'string';
    this.validator = (data) => typeof data === 'string';
    return this;
  }
  boolean() {
    this.type = 'boolean';
    this.validator = (data) => typeof data === 'boolean';
    return this;
  }
  oneToOne() {
    this.type = 'oneToOne';
    this.validator = (data) => typeof data === 'string';
    return this;
  }
  any() {
    this.type = 'any';
    this.validator = (data) => true;
    return this;
  }
  regex(reg) {
    if(this.type !== 'string')
      throw new Error('Using regex on a non-string field');
    return this;
  }
  required() {
    this._required = true;
    return this;
  }
  notIdentity() {
    this._notIdentity = true;
    return this;
  }
  done() {
    return this.model;
  }
}

let databases = {};

class Model {
  constructor(name) {
    this.name = name;
    this.dbName = snakeCase(name) + 's';
    this.dbPath = path.join(dataDir, this.dbName + '.db');
    this.fields = [];
    this.relations = [];
    this.methods = [];

    this.emitter = new events.EventEmitter();

    this.field('_id').string();
  }
  field(name) {
    let field = new ModelField(name, this);
    this.fields.push(field);
    return field;
  }
  oneToMany(manyModel, fieldName) {
    assert(manyModel !== undefined);
    assert(manyModel !== {});
    this.relations.push({
      model: manyModel,
      fieldName: fieldName,
      type: 'oneToMany'
    });
    return this;
  }
  noDuplicates() {
    this._noDuplicates = true;
    return this;
  }
  acceptsEmptyQuery() {
    this.acceptsEmptyQuery = true;
    return this;
  }
  implement(funcName, func) {
    this.methods.push({
      name: funcName,
      callback: func
    });
    return this;
  }
  hook(evt, callback) {
    this.emitter.on(evt, callback);
    return this;
  }

  done() {
    let db = undefined, self = this;
    self.emitter.emit('done:before');

    if (databases[self.dbPath]) {
      console.log('Not loading db again...');
      db = databases[self.dbPath];
    } else {
      db = new Datastore(self.dbPath);
      db.loadDatabase();
      databases[self.dbPath] = db;
    }

    let model = function (d) {
      self.emitter.emit('construct:before', this);
      d = d || {};
      if (typeof d === 'string') {
        if (self._default) {
          let val = d;
          d = {};
          d[self._default] = val;
        } else {
          throw new Error('Cannot accept a string as an object');
        }
      }
      this.data = {};
      // let data = Lazy(d).pick(this.fields.map(f => f.name));
      for (let index in self.fields) {
        let field = self.fields[index];
        let value = d[field.name];
        this.data[field.name] = value || field._defaultValue;
      }
      this._id = this.data._id;
      self.emitter.emit('construct:after', this);
    }

    // We add the custom functions
    for (let index in self.methods) {
        let method = self.methods[index];
        model.prototype[method.name] = method.callback;
    }

    model.model = self;
    model.prototype.getPayload = function () {
      self.emitter.emit('getPayload:before', this);
      let payload = {};

      for (let index in self.fields) {
        let field = self.fields[index];
        let value = this.data[field.name];

        if (typeof value === 'undefined' && field._required)
          throw new Error(`Field ${field.name} is required`);

        if (field.validator && !field.validator(value)) {
          if (field._required)
            throw new Error(`Field ${field.name} is required but has invalid value`);
          // else
            // console.warn(`Dropping field ${field.name} with ${value}`);
        } else {
          payload[field.name] = value;
        }
      }
      self.emitter.emit('getPayload:after', this);
      return payload;
    }

    model.prototype.create = async function () {
      self.emitter.emit('create:before', this);
      if (this._id || this.data._id)
        throw new Error('Object is already from database');

      if (self._noDuplicates) {
        if (!self._default) {
          throw new Error('No dups specified but no default field');
        }
        let q = {};
        q[self._default] = this.data[self._default];
        let res = await db.find(q);
        if (res.length > 0)
          throw new Error('Entry is already existing and dups found');
      }


     let res = await db.insert(this.getPayload());

      this._id = this.data._id = res._id;
      self.emitter.emit('create:after', this);
    }

    model.prototype.set = function (key, value) {
      if (key === '_id') {
        throw new Error('Cannot set _id');
      }
      this.data[key] = value;
    }

    model.prototype.update = async function (key, value) {
      self.emitter.emit('update:before', this);
      if (!this._id) {
        throw new Error('Cannot update ghost model');
      }

      await db.update({_id: this._id}, this.getPayload());
      self.emitter.emit('update:after', this);
      return;
    }

    model.findById = async function (id) {
      return (await model.find({_id: id, limit: 1}))[0];
    }

    model.find = async function (query, forceEmpty) {
      let q = Lazy(query)
        .omit(self.fields.filter(f => f.notIdentity))
        .pick(self.fields.map(f => f.name))
        .value();

      // if (Object.keys(q).length  == 0 && !self.acceptsEmptyQuery
      //   && !forceEmpty) {
      //   throw new Error('Empty or invalid query');
      // }

      let opts = Lazy(query).pick([
        'limit', 'offset', 'sort', 'direction'
      ]).value();

      if (!opts.limit || opts.limit > 500 || opts.limit < 1) {
        opts.limit = 500;
      }

      let sort = {};
      sort[opts.sort || 'name'] = opts.direction ?
        (opts.direction == 'asc' ? 1 : -1) : 1;

      let res = (await db.cfind(q).sort(sort).limit(opts.limit)
        .skip(opts.skip || 0).exec()).map(d => new model(d));

      res.query = Lazy(q).merge(opts).value();
      return res;
    }
    // for (let i in this.fields.filter(t => t.type == 'oneToOne')) {
    //   let field = this.fields[i];
    //   model.prototype['get' + pascalCase(field.name)] = {
    //
    //   }
    // }

    for (let rel of this.relations) {

      if (rel.type === 'oneToMany') {
        let m = 'get' + pascalCase(pluralize(rel.model.model.name));
        model.prototype[m] = function (query) {
          self.emitter.emit(m + ':before', this);
          query = query || {};
          if (!this._id) {
            throw new Error('Can\'t get children of unserialized object');
          }
          query[rel.fieldName] = this._id;
          self.emitter.emit(m + ':after', this);
          return rel.model.find(query);
        }
      }
    }
    return model;
  }
}

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

export default Model;

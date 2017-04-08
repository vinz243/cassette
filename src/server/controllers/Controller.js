const assert = require("assert");
const pascalCase = require("pascal-case");
const pluralize = require("pluralize");
const omit = require("lodash/omit");

const fetchable = module.exports.fetchable = (name, find, findById) => ({
  [`/api/v2/${pluralize(name)}`]: {
    get: async (ctx) => {
      let res = await find(ctx.query);
      ctx.status = 200;
      ctx.body = res.map(el => el.props);
    }
  },
  [`/api/v2/${pluralize(name)}/:id`]: {
    get: async (ctx) => {
      let doc = await findById(ctx.params.id);
      if (!doc) {
        return ctx.throw(404, 'Object not found in database');
      }
      ctx.status = 200;
      ctx.body = doc.props;
    }
  }
});

const createable = module.exports.createable = (name, model) => ({
  [`/api/v2/${pluralize(name)}`]: {
    post: async (ctx) => {
      let object = model(Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {}));
      if (!Object.keys(object.props)) {
        return ctx.throw(400, `None of the properties provided are acceptable`);
      }
      await object.create();
      ctx.status = object.props._id ? 201 : 202;
      ctx.body = object.props;
    }
  }
});

const removeable = module.exports.removeable = (name, findById) => ({
  [`/api/v2/${pluralize(name)}/:id`]: {
    del: async (ctx) => {
      let doc = await findById(ctx.params.id);
      if (!doc) {
        return ctx.throw(404, `Entity #${ctx.params.id} not found`);
      }
      await doc.remove();
      ctx.status = doc.props._id ? 202 : 200;
    }
  }
});

const updateable = module.exports.updateable = (name, findById) => ({
  [`/api/v2/${pluralize(name)}/:id`]: {
    put: async (ctx) => {
      let doc = await findById(ctx.params.id);
      if (!doc) {
        return ctx.throw(404, `Entity #${ctx.params.id} not found`);
      }
      let props = Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {});

      Object.keys(props).forEach(key => {
        doc.set(key, props[key]);
      });

      await doc.update();
      ctx.status = 200;
      return;
    }
  }
});

const oneToMany = module.exports.oneToMany = (name, childName, findChildren, path = name) => ({
  [`/api/v2/${pluralize(name)}/:id/${pluralize(childName)}`]: {
    get: async (ctx) => {
      let children = await findChildren(Object.assign({},
        {[name]: ctx.params.id - 0}, ctx.query));
      ctx.status = 200;
      ctx.body = children.map(child => child.props);
      return;
    }
  }
});

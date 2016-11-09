import assert from 'assert';
import Lazy from 'lazy.js';
import pascalCase from 'pascal-case';
import pluralize from 'pluralize';

class Controller {
  constructor(model) {
    this._model = model;
  }
  prefix(prefix) {
    this._prefix = prefix;
    return this;
  }
  allowPost() {
    this._allowPost = true;
    return this;
  }
  allowPut() {
    this._allowPut = true;
    return this;
  }
  allowDel() {
    this._allowDel = true;
    return this;
}
  allowSearches() {
    this._allowSearches = true;
    return this;
  }
  done() {
    let self = this, routes = {},
      base = '/v1' + (this._prefix || '') + '/'
        + pluralize(this._model.model.name);

    routes[base] = {
      get: async (ctx, next) => {
        let res = await self._model.find(ctx.query);
        ctx.body = {
          status: 'success',
          data: res.map(d => d.data),
          length: res.length,
          payload: {
            query: res.query
          }
        }
      }
    };

    routes[base + '/searches'] =  {
      post: async (ctx, next) => {
        let q = Lazy(ctx.request.fields || ctx.request.body || {})
            .merge(ctx.query || {}).value();

        for (let key in q) {
          let val = q[key];

          if (val[0] === '/' && val[val.length - 1] === '/') {
            q[key] = new RegExp(val.slice(1, -1), 'i');
          }
        }
        // cons
        let res = await self._model.find(q);

        ctx.body = {
          status: 'success',
          data: res.map(d => d.data),
          length: res.length,
          payload: {
            body: res.query
          }
        }
        ctx.status = 200;
      }
    }

    routes[base + '/:id'] = {
      get: async (ctx, next) => {
        if (!ctx.params.id || ctx.params.id === '') return ctx.redirect(base);

        let res = await self._model.findById(ctx.params.id);

        if (res) {
          ctx.body = {
            status: 'success',
            data: res.data,
            payload: {
              params: {
                id: ctx.params.id
              }
            }
          }
        }
        else {
          ctx.body = {
            status: 'failure',
            payload: {
              params: {
                id: ctx.params.id
              }
            }
          }
          ctx.status = 404;
        }
      }
    }
    for (let rel of this._model.model.relations) {
      if (rel.type === 'oneToMany') {
        let m = 'get' + pascalCase(pluralize(rel.model.model.name));
        let path = base + '/:id/' + pluralize(rel.model.model.name);
        routes[path] = {
          get: async (ctx, next) => {
            let doc = await self._model.findById(ctx.params.id);
            if (!doc) {
              ctx.body = {
                status: 'failed',
                data: {
                  error_message: 'Document not found',
                  error_code: 'ENOTFOUND'
                },
                payload: {
                  query: res.query,
                }
              };

              ctx.status = 404;
              return;
            }
            let res = await doc[m](ctx.query);
            ctx.body = {
              status: 'success',
              data: res.map(d => d.data),
              length: res.length,
              payload: {
                query: res.query
              }
            }
          }
        }
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
    return routes;
  }
}

export default Controller;

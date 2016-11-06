import pluralize from 'pluralize';

class Controller {
  constructor(model) {
    this._model = model;
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
    let self = this, routes = {}, base = '/v1/' + pluralize(this._model.model.name);

    routes[base] = {
      get: async (ctx, next) => {
        let res = await self._model.find(ctx.query);
        ctx.body = {
          status: 'success',
          data: res.map(d => d.body),
          length: res.length,
          payload: {
            query: res.query
          }
        }
      }
    };


    routes[base + '/:id'] = {
      get: async (ctx, next) => {
        if (!ctx.params.id) return ctx.redirect(base);

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

    // for (let index in this._model.fields) {
    //   let field = this._model.fields[index];
    //   if (field.type === 'oneToOne') {
    //     // routes[base + '/:id/' + pluralize(field.name)] = {
    //     //   get: async (ctx, next) => {
    //     //     let res = await self.
    //     //   }
    //     // }
    //   }

    // }
    return routes;
  }
}

export default Controller;

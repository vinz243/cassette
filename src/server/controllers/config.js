 import config from '../models/config';


let routes = {
  '/v1/config/:key':  {
    get: async function (ctx, next) {

      let value = await config.getValue(ctx.params.key);
      // console.log("value", value);
      ctx.body = {
        status: 200,
        success: true,
        data: value
      };
      ctx.status = 200;
      return;
    },
    put: async function (ctx, next) {
      let fields = ctx.request.fields || ctx.request.body || {};
      // console.log('keys', ctx.params);
      ctx.body = await config.updateValue(ctx.params.key, fields.value);
      ctx.status = ctx.body.status;
      return;
    }
  },
  '/v1/config': {
    post: async function (ctx, next) {
      console.log('posting config');
      let fields = ctx.request.fields || ctx.request.body || {};
      ctx.body = await config.insertValue(fields.key,
        fields.value);
      ctx.status = ctx.body.status;
      return;
    }
  }
}

export default routes;

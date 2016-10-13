import {Controller} from '../models/jobs';


const routes = {
  '/v1/jobs/:id': {
    get: async (ctx, next) => {
      ctx.body = await Controller.getStatus();
      ctx.status = ctx.body.code;
      return;
    }
  }
}

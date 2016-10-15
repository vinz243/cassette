import {Controller} from '../models/job';


const routes = {
  '/v1/jobs/:id': {
    get: async (ctx, next) => {
      ctx.body = await Controller.getStatus(ctx.params.id);
      ctx.status = ctx.body.status;
      return;
    }
  }
}

export default routes;

import Controller from './Controller';
import {Library, Scan} from '../models';
import process from 'process';
const routes = new Controller(Library)
  .allowPost()
  .done();

routes['/v1/libraries/:id/scans'].post = async (ctx, next) => {
  let scan = new Scan(ctx.params.id);
  scan.data.statusMessage = 'Pending...';
  scan.data.statusCode = 'PENDING';
  scan.data.dryRun = (ctx.request.fields || ctx.request.body || {}).dryRun || false;
  await scan.create();

  ctx.status = 201;
  ctx.body = {
    status: 'success',
    data: scan.data,
    payload: {
      params: {
        id: ctx.params.id
      }, query: {}, body: {}
    }
  }
  process.nextTick(() => {
    scan.startScan();
  });
};
routes['/v1/libraries/:id/scans/:scanId'] = {
  get: async (ctx, next) => {
    let scan = await Scan.findById(ctx.params.scanId);
    if (scan.data.libraryId !== ctx.params.id) return next();
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: scan.data,
      payload: {
        params: {
          libraryId: ctx.params.id,
          scanId: ctx.params.scanId
        }, query: {}
      }
    }

  }
};
export default routes;

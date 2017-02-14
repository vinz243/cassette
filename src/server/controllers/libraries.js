import {fetchable, oneToMany, updateable, createable} from './Controller';
import merge from 'lodash/merge';
import process from 'process';
import {Scan, findScanById} from '../models/Scan';
import {Library, find, findById} from '../models/Library';


export default merge({},
  fetchable('library', find, findById), createable('library', Library), {
    '/api/v2/libraries/:id/scans': {
      post: async (ctx, next) => {
        let scan = Scan({
          library: ctx.params.id,
          statusMessage: 'Pending',
          statusCode: 'PENDING',
          dryRun: (ctx.request.fields || ctx.request.body || {}).dryRun || false
        });

        await scan.create();

        ctx.status = 201;
        ctx.body = scan.props;

        process.nextTick(() => {
          scan.startScan();
        });
      }
    }, '/api/v2/libraries/:id/scans/:scanId': {
      get: async (ctx, next) => {
        let scan = findScanById(ctx.params.scanId);
        if (scan.doc.library !== ctx.params.id) return next();
        ctx.status = 200;
        ctx.body = scan.props;
      }
    }
});

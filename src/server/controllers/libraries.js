const {fetchable, oneToMany, updateable, createable} = require('./Controller');
const merge = require("lodash/merge");
const process = require("process");
const {Scan, findScanById} = require('../models/Scan');
const {Library, find, findById} = require('../models/Library');


module.exports = merge({},
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
        let scan =Scan.findById(ctx.params.scanId);
        if (scan.doc.library !== ctx.params.id) return next();
        ctx.status = 200;
        ctx.body = scan.props;
      }
    }
});

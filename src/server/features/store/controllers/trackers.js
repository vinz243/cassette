const Tracker = require('features/store/models/tracker');

const {fetchable, oneToMany, updateable, createable} = require('controllers/Controller');
const merge   = require("lodash/merge");

module.exports = merge({},
  fetchable('tracker', Tracker.find, Tracker.findById),
  createable('tracker', Tracker),
  updateable('tracker', Tracker.findById), {
  '/api/v2/trackers/:id/status': {
    get: async function (ctx) {
      const tracker = await Tracker.findById(+ctx.params.id);
      if (!tracker) {
        return ctx.throw(404, 'Tracker no found');
      }
      await tracker.checkStatus();

      await tracker.populate();
      ctx.body = {
        message: tracker.props.message,
        status: tracker.props.status
      };
      ctx.status = 200;
    }
  }
});

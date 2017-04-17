const checks = require('./checks');
const checklist = {};

module.exports = {
  '/api/v2/checks/:id':  {
    get: function (ctx) {
      if (checklist[ctx.params.id]) {
        ctx.body = checklist[ctx.params.id];
        ctx.status = 200;
      } else {
        checklist[ctx.params.id] = {};
        checks.checklist.forEach((check) => {
          checklist[ctx.params.id][check] = {
            status: 'uk',
            message: 'Please wait'
          };
          checks.checks[check]().then((res) => {
            checklist[ctx.params.id][check] = res;
          });
        });
        ctx.body = Object.assign(checklist[ctx.params.id]);
        ctx.status = 201;
      }
    }
  }
}

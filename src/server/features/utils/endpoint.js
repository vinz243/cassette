const config = require('config');
const os = require('os');
const fs = require('fs-promise');
const path = require('path');

module.exports = {
  '/api/v2/vars': {
    get: function (ctx) {
      ctx.cacheControl('30m');
      ctx.body = {
        configRoot: config.get('configRoot'),
        homedir: os.homedir()
      }
      ctx.status = 200;
    }
  },
  '/api/v2/fs/:dir*': {
    get: async function (ctx) {
      const {dir = ''} = ctx.params;
      const src = '/' + dir;
      try {
        const content = await fs.readdir(src);
        const dirs = content.filter(file =>
          fs.statSync(path.join(src, file)).isDirectory()).filter(
            (file) => file[0] !== '.'
          );
          ctx.cacheControl('3min');
          ctx.body = [...(src === '/' ? ['.'] : ['.']), ...dirs];
          ctx.status = 200;
      } catch (err) {
        ctx.throw(404);
      }
    }
  }
}

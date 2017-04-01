const fs    = require("fs-promise");
const path  = require('path');
const sharp = require('sharp');

module.exports = {
  '/api/v2/assets/:name': {
    get: async function (ctx) {
      const {name,} = ctx.params;
      const {size, height = size, width = size} = ctx.query;

      if (/^[\w-_]+\.\w+$/i.test(name)) {
        const file = path.join(__dirname, `../../assets/${name}`);
        const ext = path.extname(file);

        if (await fs.exists(file)) {
          const buffer = await fs.readFile(file);
          if(['.jpg', '.png'].includes(ext)) {
            if (height * width > 1)  {
              ctx.body = await sharp(buffer).resize(+height, +width).toBuffer();
            } else {
              ctx.body = await fs.readFile(file);
            }
            ctx.set('Content-Type', `image/${ext.substr(1)}`);
            ctx.status = 200;
          }
        } else {
          ctx.status = 404;
        }
      } else {
        ctx.body   = 'Asset name does not match specified format';
        ctx.status = 400;
      }
    }
  }
}

require('./init.js');

const body = require("koa-better-body");
const chalk = require("chalk");
const config = require("./config.js");
const convert = require("koa-convert");
const Koa = require("koa");
const koaRouter = require("koa-router");
const route = require("./routes");
const { mainStory, addListener } = require('storyboard');
const consoleListener = require("storyboard/lib/listeners/console").default;
if (config.get('env') !== 'test') {
  addListener(consoleListener);
}

mainStory.info('Storyboard started');
mainStory.info('Starting server');


let app = new Koa();
let router = koaRouter();
app.use(async (ctx, next) => {
  const start = Date.now();
  ctx.status = 404;
  try {
    await next();
    let color = 'green';
    if (ctx.status >= 400)
      color = 'red';
    mainStory.debug(`${ctx.method} ${chalk.underline.dim(ctx.url)}`
      +` ${Date.now() - start}ms ` + chalk[color](ctx.status));
  } catch (err) {
    let color = 'red';
    ctx.status = (ctx.status === 404) ? 500 : ctx.status;
    mainStory.error(`${ctx.method} ${chalk.underline.dim(ctx.url)}`
      +` ${Date.now() - start}ms ` + chalk[color](ctx.status), {attach: err});
  }

});

app.use(convert(body()));

route(router);

app.use(router.routes());
app.use(router.allowedMethods());

let res = app.listen();
res.app = app;
module.exports = res;

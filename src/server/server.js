import body from 'koa-better-body';
import chalk from 'chalk';
import config from './config.js';
import convert from 'koa-convert';
import Koa from 'koa';
import koaRouter from 'koa-router';
import route from './routes';
import { mainStory, addListener } from 'storyboard';
import consoleListener from 'storyboard/lib/listeners/console';
addListener(consoleListener);

mainStory.info('Storyboard started');
mainStory.info('Starting server');


let app = new Koa();
let router = koaRouter();
app.use(async (ctx, next) => {
  const start = Date.now();
  try {
    await next();
    let color = 'green';
    if (ctx.status >= 400)
      color = 'red';
    mainStory.debug(`${ctx.method} ${chalk.underline.dim(ctx.url)}`
      +` ${Date.now() - start}ms ` + chalk[color](ctx.status));
  } catch (err) {
    let color = 'red';
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
export default res;

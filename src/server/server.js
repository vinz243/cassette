import body from 'koa-better-body';
import chalk from 'chalk';
import config from './config.js';
import convert from 'koa-convert';
import Koa from 'koa';
import koaRouter from 'koa-router';
import route from './routes';
let app = new Koa();
let router = koaRouter();

app.use((ctx, next) => {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    // console.log(chalk.dim(`    ${ctx.method} ${ctx.url} - ${ms}ms - ${ctx.status}`));
  });
});

app.use(convert(body()));

route(router);

app.use(router.routes());
app.use(router.allowedMethods());

let res = app.listen();
res.app = app;
export default res;

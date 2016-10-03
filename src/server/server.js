import chalk from 'chalk';
import config from '../../config';

import koa from 'koa';
import koaRouter from 'koa-router';

let app = koa();
let router = koaRouter();


app.use(function *(next) {
  let start = new Date();

  yield next;
  var ms = new Date() - start;
  console.log(`${chalk.green(this.method)} ${chalk.dim(this.url)} - ${chalk.blue(ms)}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

// app.listen(3030);


export default app;

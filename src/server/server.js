import body from 'koa-better-body';

import chalk from 'chalk';
import config from '../../config';

import Koa from 'koa';
import koaRouter from 'koa-router';

import route from './routes';

let app = new Koa();
let router = koaRouter();


// app.use(function *(next) {
//   let start = new Date();
//   console.log(chalk.dim(this.url));
//   yield next;
//   var ms = new Date() - start;
//   console.log(`${chalk.green(this.method)} ${chalk.dim(this.url)} - ${chalk.blue(ms + 'ms') }`);
// });

app.use(body());

route(router);

app.use(router.routes());
app.use(router.allowedMethods());


export default app.listen();

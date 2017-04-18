require('./init.js');

const body       = require("koa-better-body");
const bodyParser = require('koa-bodyparser');
const convert    = require("koa-convert");
const Koa        = require("koa");
const koaRouter  = require("koa-router");
const session    = require('koa-generic-session')
const chalk      = require("chalk");
const config      = require("./config.js");
const route      = require("./routes");
const jwt        = require("jsonwebtoken");
const passport   = require('./passport');
const checks     = require('features/checks');

const { mainStory, addListener } = require('storyboard');
const consoleListener = require("storyboard/lib/listeners/console").default;
if (config.get('env') !== 'test') {
  addListener(consoleListener);
}

mainStory.info('Storyboard started');
mainStory.info('Starting server');


let app = new Koa();
let router = koaRouter();

app.use(bodyParser());

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

app.use(convert(session()));

// app.use(convert(body()));

app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
  if (ctx.url === '/api/v2/configure'
    && ctx.method === 'POST'
    && !config.isConfigured()) {

    let {username, password} = Object.assign({}, ctx.request.fields || {},
      ctx.request.body || {});

    await passport.addUser(username, password);

    config.markConfigured();
    ctx.status = 200;
    ctx.body = {'status': 'ok'};
    return;
  }
  if (ctx.url.startsWith('/api/v2/checks/')
    && ctx.method === 'GET'
    && !config.isConfigured()) {
    const route = koaRouter();
    route.get('/api/v2/checks/:id', checks['/api/v2/checks/:id'].get);
    const mw = route.routes();
    await mw(ctx);
    return;
  }
  if (ctx.url === '/api/v2/sessions' && ctx.method === 'POST') {
    await passport.authenticate('local', function (err, {username, _id}) {

      if (err) {
        ctx.throw(err);
        return;
      }

      const token = jwt.sign({username, _id}, config.get('jwtSecret'), {
        expiresIn: '14d'
      });

      ctx.body = {username, _id, token};
      ctx.status = 201;

    })(ctx);
    return;
  }

  await passport.authenticate('custom', function (err, user) {
    ctx.state.user = user;
  })(ctx);

  await next();
});

app.use(async function (ctx, next) {
  if (ctx.url === '/api/v2/status' && ctx.method === 'GET') {
    ctx.body = {
      loggedIn: ctx.isAuthenticated(),
      configured: config.isConfigured()
    }
    ctx.status = 200;
    return;
  }
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = {error: 'Not authentificated'};
    return;
  }
});

route(router);

app.use(router.routes());
app.use(router.allowedMethods());

let res = app.listen();
res.app = app;
module.exports = res;

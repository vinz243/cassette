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
const path       = require('path');
const fs         = require("fs-promise");
const sharp      = require('sharp');
const cjwt       = require('jwt');
const File       = require('models/File');

const TYPES = {
  '.jpg': 'image/jpg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
}

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
  if (ctx.url.startsWith('/api/v2/streams/') && ctx.method === 'GET') {
    const token = path.basename(ctx.url);
    try {

      const {tr_id} = cjwt.read(token);
      const file = await File.findById(+tr_id);
      const stat = fs.statSync(file.props.path);
      let mimeType = 'audio/mpeg';

      if (file.props.path.endsWith('.flac')) {
        mimeType = 'audio/flac';
      }

      let opts = {}, code = 200;

      ctx.set('Content-Type', mimeType);
      ctx.set('Content-Length', stat.size);
      ctx.set('Accept-Ranges', 'bytes');

      if (ctx.headers['range']) {
        let [b, range] = ctx.headers['range'].split('=');

        if (b === 'bytes') {
          let [start, end] = range.split('-');

          if (!end || end === '' || end < start)
            end = stat.size - 1;

          opts = {
            start: start - 0,
            end: end - 0
          };

          code = 206;
          ctx.set('Content-Range',`bytes ${start}-${end}/${stat.size}`);
          ctx.set('Content-Length', end - start + 1);
        }
      }
      ctx.status = code;
      ctx.body = fs.createReadStream(file.props.path, opts);
      return;
    } catch (err) {
      mainStory.warn('streams', 'Error raised while trying to stream', {attach: err});
      ctx.status = 410;
      ctx.body = 'Token has expired';
      return;
    }
  }
  if (ctx.url.startsWith('/api/v2/assets/') && ctx.method === 'GET') {
    const ext = path.basename(ctx.url);
    const name = ext.substr(0, ext.indexOf('?')) || ext;
    const {size, height = size, width = size} = ctx.query;

    if (/^[\w-_]+\.\w+$/i.test(name)) {
      const file = path.join(__dirname, `../../assets/${name}`);
      const ext = path.extname(file);

      if (await fs.exists(file)) {
        const buffer = await fs.readFile(file);

        if (TYPES[ext]) {
          ctx.set('Content-Type', TYPES[ext]);
        }

        if(['.jpg', '.png'].includes(ext)) {
          if (height * width > 1)  {
            ctx.body = await sharp(buffer).resize(+height, +width).toBuffer();
          } else {
            ctx.body = await fs.readFile(file);
          }
          ctx.status = 200;
          return;
        } else {
          ctx.body = buffer;
          ctx.status = 200;
          return;
        }
      } else {
        ctx.status = 404;
        return;
      }
    } else {
      ctx.body   = 'Asset name does not match specified format';
      ctx.status = 400;
      return;
    }
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
  if (ctx.isAuthenticated() || process.argv.includes('--guest')) {
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

import agent from 'supertest-koa-agent';
import config from '../../../config';
import supertest from 'supertest-as-promised'
import test from 'ava';
import app from '../../../src/server/server.js';

const request = supertest((app));

test('rootDir is a temp dir different from baseDir', t => {
  t.not(config.rootDir, config.baseDir);
});


test.serial('server can post to create new config entry', async t => {
  t.plan(2);

  const res = await request.post('/v1/config').send({
    key: 'foo',
    value: '42'
  }).expect(201);
  t.is(res.status, 201);
  t.deepEqual(res.body, {
    success: true,
    status: 201,
    data: {}
  });
});

test.serial('can fetch config entry', async t => {
  t.plan(2);
  const res2 = await request.get('/v1/config/foo').expect(200);
  t.is(res2.status, 200);
  t.deepEqual(res2.body, {
    success: true,
    status: 200,
    data: {
      key: 'foo',
      value: '42'
    }
  });
});
test.serial('won\'t create two config entry for same key', async t => {
  t.plan(4);

  const res = await request.post('/v1/config').send({
    key: 'foo',
    value: 'Bilbo Baggins'
  }).expect(400);
  t.is(res.status, 400);
  t.deepEqual(res.body, {
    success: false,
    status: 400,
    data: {
      error_message: 'A config entry already exists with this key',
      error_code: 'EDUPENTRY'
    }
  });

  const res2 = await request.get('/v1/config/foo').expect(200);
  t.is(res2.status, 200);
  t.deepEqual(res2.body, {
    success: true,
    status: 200,
    data: {
      key: 'foo',
      value: '42'
    }
  });
});


test.serial('can update a value', async t => {
  t.plan(2);
  const res = await request.put('/v1/config/foo').send({
    value: '1337'
  });

  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: true,
    status: 200,
    data: {

    }
  });
});

test.serial('new value is upated', async t => {
  t.plan(2);
  const res = await request.get('/v1/config/foo').expect(200);
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: true,
    status: 200,
    data: {
      key: 'foo',
      value: '1337'
    }
  });
});

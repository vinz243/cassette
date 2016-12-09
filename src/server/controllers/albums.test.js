import {Album} from '../models';
import supertest from 'supertest-as-promised';
import app from '../server.js';

import test from 'ava';


const request = supertest((app));


test('lists albums', async t => {
  let res = await request.get('/v1/albums');
  t.is(res.body.length, 0);
  t.is(res.body.data.length, 0);

  await (new Album({name: 'Foo'})).create();

  res = await request.get('/v1/albums');
  for(let album of res.body.data) {
    if ((album || {}).name === 'Foo') return;
  }
  t.fail('created album not found');
});

test('get one album', async t => {
  let distantRelatives = new Album('Distant Relatives');
  await distantRelatives.create();

  let res = await request.get('/v1/albums/' + distantRelatives._id);
  t.is(res.body.data.name, 'Distant Relatives');
});

test('search albums', async t => {
  await (new Album('TestA')).create();
  await (new Album('TestB')).create();
  await (new Album('TestC')).create();
  await (new Album('JesdD')).create();

  let res = await request.post('/v1/albums/searches').send({
    name: '/test/'
  });
  t.is(res.body.length, 3);
});

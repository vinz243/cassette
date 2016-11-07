import {Artist} from '../../../src/server/models';
import supertest from 'supertest-as-promised';
import app from '../../../src/server/server.js';

import test from 'ava';


const request = supertest((app));


test('lists artists', async t => {
  let res = await request.get('/v1/artists');
  t.is(res.body.length, 0);
  t.is(res.body.data.length, 0);

  await (new Artist({name: 'Foo'})).create();

  res = await request.get('/v1/artists');

  for(let artist of res.body.data) {
    if (artist.name === 'Foo') return;
  }
  t.fail('created artist not found');
});

test('get one artist', async t => {
  let systemOfADown = new Artist('System Of A Dawn');
  systemOfADown.data.genre = 'Alt Metal';
  await systemOfADown.create();

  let res = await request.get('/v1/artists/' + systemOfADown._id);
  t.is(res.body.data.name, 'System Of A Dawn');
  t.is(res.body.data.genre, 'Alt Metal');
});

test('search artists', async t => {
  await (new Artist('TestA')).create();
  await (new Artist('TestB')).create();
  await (new Artist('TestC')).create();
  await (new Artist('JesdD')).create();

  let res = await request.post('/v1/artists/searches').send({
    name: '/test/'
  });
  t.is(res.body.length, 3);
});

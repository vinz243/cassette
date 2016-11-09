import {Artist, Album, Track} from '../../../src/server/models';
import supertest from 'supertest-as-promised';
import app from '../../../src/server/server.js';

import test from 'ava';


const request = supertest((app));


test('/v1/artists', async t => {
  let res = await request.get('/v1/artists');
  t.is(res.body.length, 0);
  t.is(res.body.data.length, 0);

  await (new Artist({name: 'Foo'})).create();

  res = await request.get('/v1/artists');
  for(let artist of res.body.data) {
    if ((artist || {}).name === 'Foo') return;
  }
  t.fail('created artist not found');
});

test('/v1/artists/:id', async t => {
  let systemOfADown = new Artist('System Of A Dawn');
  systemOfADown.data.genre = 'Alt Metal';
  await systemOfADown.create();

  let res = await request.get('/v1/artists/' + systemOfADown._id);
  t.is(res.body.data.name, 'System Of A Dawn');
  t.is(res.body.data.genre, 'Alt Metal');
});

test('/v1/artists/:id/searches', async t => {
  await (new Artist('TestA')).create();
  await (new Artist('TestB')).create();
  await (new Artist('TestC')).create();
  await (new Artist('JesdD')).create();

  let res = await request.post('/v1/artists/searches').send({
    name: '/test/'
  });
  t.is(res.body.length, 3);
});
test('/v1/artists/:id/albums and tracks', async t => {
  let alborosie = new Artist({
    name: 'Alborosie',
    genre: 'Reggae'
  });
  await alborosie.create();

  let soulPirate = new Album({
    name: 'Soul Pirate',
    artistId: alborosie._id
  });
  await soulPirate.create();

  let freedomFyah = new Album({
    name: 'Freedom & Fyah',
    artistId: alborosie._id
  });
  await freedomFyah.create()

  // Create another artist&album
  let coldplay = new Artist({
    name: 'Coldplay',
    genre: 'Commercialized Music'
  });
  await coldplay.create();

  let ghostStories = new Album({
    name: 'Ghost Stories',
    artistId: coldplay._id
  });
  await ghostStories.create();

  let res = await request.get('/v1/artists/'+alborosie._id+'/albums')
    .expect(200);
  t.is(res.body.length, 2);
  t.is(res.body.data.length, 2);

  t.not(res.body.data[0].name, undefined);
  t.not(res.body.data[1].name, undefined);

  t.is(res.body.data[0].artistId, alborosie._id);
  t.is(res.body.data[1].artistId, alborosie._id);

  await (new Track({name: 'Herbalist', artistId: alborosie._id})).create();

  res = await request.get('/v1/artists/'+alborosie._id+'/tracks');
  t.is(res.body.length, 1);
  t.is(res.body.data[0].name, 'Herbalist');
});

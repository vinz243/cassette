const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Track = require('../models/Track');
const supertest = require("supertest-as-promised");
const app = require("../server.js");

const test = require("ava");


const request = supertest(app);


test.serial('/api/v2/artists', async t => {
  let res = await request.get('/api/v2/artists');
  t.is(res.body.length, 0);
  t.is(res.body.length, 0);

  await (Artist({name: 'Foo'})).create();

  res = await request.get('/api/v2/artists');
  for(let artist of res.body) {
    if ((artist || {}).name === 'Foo') return;
  }
  t.fail('created artist not found');
});

test.serial('/api/v2/artists/:id', async t => {
  let systemOfADown = Artist({
    name: 'System Of A Down',
    genre: 'Alt Metal'
  });
  await systemOfADown.create();

  let res = await request.get('/api/v2/artists/' + systemOfADown.props._id);
  t.is(res.body.name, 'System Of A Down');
  t.is(res.body.genre, 'Alt Metal');
});

// test.serial('/api/v2/artists/:id/searches', async t => {
//   await (new Artist('TestA')).create();
//   await (new Artist('TestB')).create();
//   await (new Artist('TestC')).create();
//   await (new Artist('JesdD')).create();
//
//   let res = await request.post('/api/v2/artists/searches').send({
//     name: '/test/'
//   });
//   t.is(res.body.length, 3);
// });

test.serial('/api/v2/artists/:id/albums and tracks', async t => {
  let alborosie = Artist({
    name: 'Alborosie',
    genre: 'Reggae'
  });
  await alborosie.create();

  let soulPirate = Album({
    name: 'Soul Pirate',
    artist: alborosie.props._id
  });
  await soulPirate.create();

  let freedomFyah = new Album({
    name: 'Freedom & Fyah',
    artist: alborosie.props._id
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
    artist: coldplay.props._id
  });
  await ghostStories.create();

  let res = await request.get('/api/v2/artists/'+alborosie.props._id+'/albums')
    .expect(200);

  t.is(res.body.length, 2);
  t.is(res.body.length, 2);

  t.not(res.body[0].name, undefined);
  t.not(res.body[1].name, undefined);
  // t.deepEqual(res.body[0].artist, alborosie.doc);
  // t.deepEqual(res.body[1].artist, alborosie.doc);

  await (new Track({name: 'Herbalist', artist: alborosie.props._id})).create();

  res = await request.get('/api/v2/artists/'+alborosie.props._id+'/tracks');
  t.is(res.body.length, 1);
  t.is(res.body[0].name, 'Herbalist');
});

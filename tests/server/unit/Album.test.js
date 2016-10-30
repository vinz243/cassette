import {Artist, Album} from '../../../src/server/models';

import test from 'ava';


test('creates an Album object with correct props', t => {
  let soulPirate = new Album('Soul Pirate');
  t.is(soulPirate.data.name, 'Soul Pirate');

  let freedomAndFyah = new Album({
    name: 'Freedom & Fyah',
    year: 2016,
    artistId: 42
  });

  t.is(freedomAndFyah.data.name, 'Freedom & Fyah');
  t.is(freedomAndFyah.data.year, 2016);
  t.is(freedomAndFyah.data.artistId, 42);
});

test('inserts an album to DB and fetch it', async t => {
  let foo = new Album('foo');
  t.falsy(foo._id);
  await foo.create();
  t.not(foo._id, undefined);

  let res = await Album.findById(foo._id);

  t.is(res.data.name, 'foo');
  t.truthy(res instanceof Album);
});

test('find multiple docs', async t => {
  let albumOne = new Album('Album One');
  albumOne.data.year = 1998;
  await albumOne.create();

  let albumTwo = new Album('Album Two');
  albumTwo.data.year = 1998;
  await albumTwo.create();

  let res = await Album.find({year: 1998});
  t.is(res.length, 2);
});

test('won\'t create multiple time', async t => {
  let bar = new Album('bar');
  bar.data.year = 1337;
  await bar.create();
  t.throws(bar.create());
});

test('won\'t create fetched album', async t => {
  let another =  new Album('Another Album');
  await another.create();

  let a = await Album.findById(another._id);
  t.throws(a.create());
});
// 
// test('won\'t query nothing', async t => {
//   t.throws(Album.find({}));
//   t.throws(Album.find({foo: 'bar'}));
// })

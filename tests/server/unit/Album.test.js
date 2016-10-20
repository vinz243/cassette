import {Artist, Album} from '../../../src/server/models';

import test from 'ava';


test('creates an Album object with correct props', t => {
  let soulPirate = new Album('Soul Pirate');
  t.is(soulPirate.name, 'Soul Pirate');

  let freedomAndFyah = new Album({
    name: 'Freedom & Fyah',
    year: '2016',
    artistId: 42
  });

  t.is(freedomAndFyah.name, 'Freedom & Fyah');
  t.is(freedomAndFyah.year, '2016');
  t.is(freedomAndFyah.artistId, 42);
});

test('inserts an album to DB and fetch it', async t => {
  let foo = new Album('foo');
  t.falsy(foo._id);
  await foo.create();
  t.not(foo._id, undefined);

  let res = await Album.getById(foo._id);

  t.is(res.name, 'foo');
  t.truthy(res instanceof Album);
});

test('get multiple docs', async t => {
  let albumOne = new Album('Album One');
  albumOne.year = '1998';
  await albumOne.create();

  let albumTwo = new Album('Album Two');
  albumTwo.year = '1998';
  await albumTwo.create();

  let res = await Album.get({year: '1998'});
  t.is(res.length, 2);
});

test('won\'t create multiple time', async t => {
  let bar =  new Album('bar');
  await bar.create();
  t.throws(bar.create());
});

test('won\'t create fetched album', async t => {
  let another =  new Album('Another Album');
  await another.create();

  let a = await Album.getById(another._id);
  t.throws(a.create());
});

test('won\'t query nothing', async t => {
  t.throws(Album.get({}));
  t.throws(Album.get({foo: 'bar'}));
})

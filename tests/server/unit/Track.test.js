import {Artist, Album, Track} from '../../../src/server/models';

import test from 'ava';


test('creates an Track object with correct props', t => {
  let herbalist = new Track('Herbalist');
  t.is(herbalist.name, 'Herbalist');

  let kingstonTown = new Track({
    name: 'Kingston Town',
    duration: '13:37',
    artistId: '42',
    albumId: '1337'
  });

  t.is(kingstonTown.name, 'Kingston Town');
  t.is(kingstonTown.duration, '13:37');
  t.is(kingstonTown.artistId, '42');
  t.is(kingstonTown.albumId, '1337');
});

test('inserts an album to DB and fetch it', async t => {
  let foo = new Track('foo');
  t.falsy(foo._id);
  await foo.create();
  t.not(foo._id, undefined);

  let res = await Track.getById(foo._id);

  t.is(res.name, 'foo');
  t.truthy(res instanceof Track);
});

test('get multiple docs', async t => {
  let trackOne = new Track('Track One');
  trackOne.albumId = '42';
  await trackOne.create();

  let trackTwo = new Track('Track Two');
  trackTwo.albumId = '42';
  await trackTwo.create();

  let res = await Track.get({albumId: '42'});
  t.is(res.length, 2);
});

test('won\'t create multiple time', async t => {
  let bar =  new Track('bar');
  await bar.create();
  t.throws(bar.create());
});

test('won\'t create fetched track', async t => {
  let another =  new Track('Another Track');
  await another.create();

  let a = await Track.getById(another._id);
  t.throws(a.create());
});

test('won\'t query nothing', async t => {
  t.throws(Track.get({}));
  t.throws(Track.get({foo: 'bar'}));
})

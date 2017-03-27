const {Track, findOne, findById, find} = require('./Track');
const Artist = require('./Artist');
const Album = require('./Album');

const omit = require("lodash/omit");

const test = require("ava");


test('creates an Track object with correct props', t => {
  let herbalist = Track('Herbalist');
  t.is(herbalist.data.name, 'Herbalist');

  let kingstonTown = Track({
    name: 'Kingston Town',
    duration: '13:37',
    artist: '42',
    album: '1337'
  });

  t.is(kingstonTown.data.name, 'Kingston Town');
  t.is(kingstonTown.data.duration, '13:37');
  t.is(kingstonTown.data.artist, '42');
  t.is(kingstonTown.data.album, '1337');
});

test('inserts an album to DB and fetch it', async t => {
  let foo = Track('foo');
  t.falsy(foo.props._id);
  await foo.create();
  t.not(foo.props._id, undefined);

  let res = await findById(foo.data._id);

  t.is(res.props.name, 'foo');
});

test('find multiple docs', async t => {
  let trackOne = Track({name: 'Track One', album: '42'});
  await trackOne.create();

  let trackTwo = Track({name: 'Track Two', album: '42'});
  await trackTwo.create();

  let res = await find({album: '42'});
  t.is(res.length, 2);
});

test('won\'t create multiple time', async t => {
  let bar =  Track('bar');
  await bar.create();
  t.throws(bar.create());
});

test('won\'t create fetched track', async t => {
  let another =  Track('Another Track');
  await another.create();

  let a = await findById(another.props._id);
  t.throws(a.create());
});

test('populate - populates artist and album', async t => {
  let artist = Artist('some dude');
  await artist.create();

  let album = Album({
    name: 'some shit',
    artist: artist.props._id
  });
  await album.create();

  await Promise.all[Track({
    name: 'first shit',
    artist: artist.props._id,
    album: album.props._id
  }).create(), Track({
    name: 'second shit',
    artist: artist.props._id,
    album: album.props._id
  }).create()];

  t.deepEqual((await find({name: /shit/})).map(el => omit(el.props, '_id')),[{
    name: 'first shit',
    artist: artist.props,
    album: album.props
  }, {
    name: 'second shit',
    artist: artist.props,
    album: album.props
  }]);
  t.deepEqual((await find({album: album.props._id})).map(el => omit(el.props, '_id')),[{
    name: 'first shit',
    artist: artist.props,
    album: album.props
  }, {
    name: 'second shit',
    artist: artist.props,
    album: album.props
  }]);
});
// test('won\'t query nothing', async t => {
//   t.throws(find({}));
//   t.throws(find({foo: 'bar'}));
// })

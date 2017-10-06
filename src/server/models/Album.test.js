const {Album, findById, find}  = require('./Album');
const Artist = require('./Artist');

const test = require("ava");

test('creates an Album object with correct props', t => {
  let soulPirate = Album('Soul Pirate');
  t.is(soulPirate.data.name, 'Soul Pirate');

  let freedomAndFyah = Album({
    name: 'Freedom & Fyah',
    year: 2016,
    artist: 42
  });
  t.is(freedomAndFyah.data.name, 'Freedom & Fyah');
  t.is(freedomAndFyah.data.year, 2016);
  t.is(freedomAndFyah.data.artist, 42);
});

test('inserts an album to DB and fetch it', async t => {
  let foo = Album('foo');
  t.falsy(foo.props._id);
  await foo.create();
  t.not(foo.props._id, undefined);

  let res = await findById(foo.props._id);

  t.is(res.data.name, 'foo');
});

test('find multiple docs', async t => {
  let albumOne = Album({
    name: 'Album One',
    year: 1998
  });
  await albumOne.create();

  let albumTwo = Album({
    name: 'Album Two',
    year: 1998
  });
  await albumTwo.create();
  let res = await find({year: 1998});
  t.is(res.length, 2);
});

test('won\'t create multiple time', async t => {
  let bar = Album('bar');
  await bar.create();
  t.throws(bar.create());
});

test('won\'t create fetched album', async t => {
  let another =  Album('Another Album');
  await another.create();

  let a = await findById(another.data._id);
  t.throws(a.create());
});

test('populate - populates artist', async t => {
  let artist = Artist('someDude');
  await artist.create();

  let album = Album({name: 'some random shit', artist: artist.props._id});
  await album.create();
  let res = (await findById(album.props._id)).props;
  t.deepEqual(res, {
    _id: album.props._id,
    name: 'some random shit',
    artist: {
      _id: artist.props._id,
      name: 'someDude'
    }
  });
});
//
// test('won\'t query nothing', async t => {
//   t.throws(find({}));
//   t.throws(find({foo: 'bar'}));
// })

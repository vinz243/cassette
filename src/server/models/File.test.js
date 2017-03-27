const {File, findOne, findById, find} = require('./File');
const Track = require('./Track');
const Artist = require('./Artist');
const Album = require('./Album');

const omit = require("lodash/omit");

const test = require("ava");

test('creates an object with expected props and no more', t => {
  let data = {
    _id: 'id of file',
    path: 'abs path to file',
    format: 'format',
    bitrate: 320,
    size: 'file size in bytes',
    duration: 1337,
    track: 'track id',
    album: 'album id',
    artist: 'artist id'
  };

  let track = File(data);
  for(let key in data) {
    t.is(track.data[key], data[key]);
    t.is(track.props[key], data[key]);
  }
});

test('creates object and insert it to db', async t => {
  let file  = File({
    path: '/home/Music/track01.flac',
    lossless: true
  });
  await file.create();
  t.not(file.props._id, undefined);
});

test('creates an object, insert it and fetch it by _id', async t => {
  let file = File({
    path: '/foo/bar',
    bitrate: 320
  });
  await file.create();
  t.not(file.props._id, undefined);

  let res = await findById(file.props._id);
  t.is(res.data.path, '/foo/bar');
  t.is(res.data.bitrate, 320);
});

test('creates an object and fetch it by path', async t => {
  let file = File({
    path: '/bar/foo',
    bitrate: 192
  });
  await file.create();

  t.not(file.props._id, undefined);

  let [res] = await find({path: '/bar/foo'});
  t.is(+res.props._id, +file.props._id);
});

test('populate - works', async t => {
  let artist = Artist('some dude');
  await artist.create();

  let album = Album({
    name: 'some shit',
    artist: artist.props._id
  });
  await album.create();

  let track = Track({
    name: 'first shit',
    artist: artist.props._id,
    album: album.props._id
  });
  await track.create();

  let file = File({
    path: '/foo/bar',
    artist: artist.props._id,
    album: album.props._id,
    track: track.props._id,
  });
  await file.create();

  t.deepEqual((await findOne({artist: artist.props._id})).props, {
    _id: file.props._id,
    path: '/foo/bar',
    artist: {
      name: 'some dude',
      _id: artist.props._id
    },
    album: {
      name: 'some shit',
      artist: artist.props._id,
      _id: album.props._id
    },
    track: {
      name: 'first shit',
      artist: artist.props._id,
      album: album.props._id,
      _id: track.props._id
    }
  });
})

// test('creates two different files for track and f')

// test('', t => {
// })

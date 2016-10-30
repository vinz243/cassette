import {Artist, Album, Track, File} from '../../../src/server/models';

import test from 'ava';

test('creates an object with expected props and no more', t => {
  let data = {
    _id: 'id of file',
    path: 'abs path to file',
    format: 'format',
    bitrate: 320,
    lossless: true,
    size: 'file size in bytes',
    duration: 1337,
    trackId: 'track id',
    albumId: 'album id',
    artistId: 'artist id'
  };

  let track = new File(data);
  // console.log(track);
  for(let key in data) {
    // console.log(key);
    t.is(track.data[key], data[key]);
  }
});

test('creates object and insert it to db', async t => {
  let file  = new File({
    path: '/home/Music/track01.flac',
    lossless: true
  });
  await file.create();
  t.not(file.data._id, undefined);
});

test('creates an object, insert it and fetch it by _id', async t => {
  let file = new File({
    path: '/foo/bar',
    bitrate: 320
  });
  await file.create();
  t.not(file._id, undefined);

  let res = await File.findById(file._id);
  t.is(res.data.path, '/foo/bar');
  t.is(res.data.bitrate, 320);
});

test('creates an object and fetch it by path', async t => {
  let file = new File({
    path: '/bar/foo',
    bitrate: 192
  });
  await file.create();

  t.not(file._id, undefined);

  let res = (await File.find({path: '/bar/foo'}))[0];
  t.is(res._id, file._id);
});

// test('creates two different files for track and f')

// test('', t => {
// })

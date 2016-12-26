import {Library, Scan} from '../models';
import supertest from 'supertest-as-promised';
import path from 'path';
import assert from 'assert';
import app from '../server.js';

import test from 'ava';

const request = supertest(app);

let libraryId = undefined, scanId = undefined;

let delay = async (ms) => {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, ms);
  });
};
let dir = path.resolve('../../../data/library');

test.serial('create library', async t => {

  let res = await request.post('/v1/libraries').send({
  	name: 'test-library',
  	path: dir
  });

  t.is(res.status, 201);

  libraryId = res.body.data._id;
  t.not(libraryId, undefined);

});

test.serial('trigger scan', async t => {
	assert(libraryId !== undefined);

	let res = await request.post(`/v1/libraries/${libraryId}/scans`).send({dryRun: false});

	t.is(res.status, 201);

	scanId = res.body.data._id;
	t.not(scanId, undefined);
});

test.serial('check result', async t => {
	assert(libraryId !== undefined);
	assert(scanId !== undefined);

  await delay(250);

  let res = await request.get(`/v1/libraries/${libraryId}/scans/${scanId}`);

  const MAX_RETRY = 40;
  let retries = 1;
  while(res.body.data.statusCode === "PENDING") {
    await delay(250);
    res = await request.get(`/v1/libraries/${libraryId}/scans/${scanId}`);
    retries = retries + 1;
    if (retries > MAX_RETRY) {
      throw new Error('Max retries exceeded');
    }
  }
  t.is(res.body.data.statusCode, 'DONE');
});
let albumId = '';
test.serial('list albums', async t => {
  assert(libraryId !== undefined);
  assert(scanId !== undefined);

  let res = await request.get('/v1/albums');

  // console.log(res.body);

  t.truthy(res.body.data[0].name === 'Night Visions' || res.body.data[0].name === 'The Eminem Show');
  t.truthy(res.body.data[1].name === 'Night Visions' || res.body.data[1].name === 'The Eminem Show');

  if (res.body.data[0].name === 'Night Visions') {
    t.is(res.body.data[1].name, 'The Eminem Show');
    albumId = res.body.data[0].albumId;
  } else {
    t.is(res.body.data[1].name, 'Night Visions');
    albumId = res.body.data[1].albumId;
  }
});

let file = {};

test.serial('list files', async t => {

  let res = await request.get('/v1/files?path='+dir+'/Radioactive.flac');
  t.is(res.status, 200);

  file = res.body.data[0];
  t.is(res.body.length, 1);
  t.is(file.path, dir + '/Radioactive.flac');
});

test.serial('see commercialized "artist"', async t =>{
  let res = await request.get('/v1/artists/' + file.artistId);

  let artist = res.body.data;
  t.is(artist.name, 'Imagine Dragons');
});

test.serial('see commercialized track > /v1/tracks', async t => {
  let res = await request.get('/v1/tracks/' + file.trackId);

  let track = res.body.data;
  t.is(track.name, 'Radioactive');
});

test.serial('see commercialized track > /v1/artists/id/tracks', async t => {
  let res = await request.get('/v1/artists/'+ file.artistId + '/tracks');

  let track = res.body.data[0];
  t.is(track.name, 'Radioactive');
});
test.serial('see commercialized file > /v1/tracks/id/files', async t => {
  let res = await request.get('/v1/tracks/'+ file.trackId + '/files');

  let f = res.body.data[0];
  // t.is(f.bitrate, 214391);
  t.is(f.path, file.path);
});

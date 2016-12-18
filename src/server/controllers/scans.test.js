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

  await delay(1337);

  let res = await request.get(`/v1/libraries/${libraryId}/scans/${scanId}`);

  t.is(res.body.data.statusCode, 'DONE');
});

test.serial('list albums', async t => {
  assert(libraryId !== undefined);
  assert(scanId !== undefined);

  let res = await request.get('/v1/albums');

  // console.log(res.body);

  t.truthy(res.body.data[0].name === 'Night Visions' || res.body.data[0].name === 'The Eminem Show (Explicit Version)');
  t.truthy(res.body.data[1].name === 'Night Visions' || res.body.data[1].name === 'The Eminem Show (Explicit Version)');
});
// test.serial('list files', async t => {
//   console.log('/v1/files?path='+dir+'/Radioactive.flac');
//   let res = await request.get('/v1/files?path='+dir+'/Radioactive.flac');
//   console.log(res.body, res.status);
// });
import {Library, Scan} from '../models';
import supertest from 'supertest-as-promised';
import app from '../server.js';

import test from 'ava';

const request = supertest(app);
let delay = async (ms) => {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, ms);
  });
}
test('POST /v1/libraries', async t => {
  let res = await request.post('/v1/libraries').send({
    name: 'Library #1',
    path: '/foo/bar'
  });
  t.is(res.status, 201);

});
test('POST /v1/libraries/:id/scans', async t => {
  let res = await request.post('/v1/libraries').send({
    name: 'Library #2',
    path: '/foo/bar'
  });
  
  t.is(res.status, 201);
  let id = res.body.data._id;

  let scanRes = await request.post('/v1/libraries/' + id + '/scans')
    .send({dryRun: true});
  t.is(scanRes.status, 201);
  t.is(scanRes.body.data.statusCode, 'PENDING');
  t.is(scanRes.body.data.dryRun, true);

  // let sId = scanRes.body.data._id;
  // await delay(500);
  //
  // scanRes = await request.get('/v1/libraries/' + id + '/scans/' + sId);
  // t.is(scanRes.status, 200);
  // t.is(scanRes.body.data.statusCode, 'STARTED');
  //
  // await delay(1337);
  //
  // scanRes = await request.get('/v1/libraries/' + id + '/scans/' + sId);
  // t.is(scanRes.status, 200);
  // t.is(scanRes.body.data.statusCode, 'DONE');

});

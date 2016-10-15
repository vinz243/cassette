
import {Job, Controller} from '../../../src/server/models/job';

import config from '../../../config';
import supertest from 'supertest-as-promised'
import test from 'ava';
import app from '../../../src/server/server.js';

const request = supertest((app));

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


test('Job should create a single job and run it', async t => {

  t.plan(8);

  let flag = false;

  let job = new Job('some test', async (progress) => {
    await timeout(250);
    t.falsy(flag);
    flag = true;
    return 42;
  }).run();

  await timeout(50);

  t.is(job.status.string, 'pending');
  t.truthy(job.status.pending);
  t.falsy(job.status.rejected || job.status.fulfilled);

  await timeout(300);

  t.is(job.status.string, 'success');
  t.truthy(job.status.fulfilled);
  t.falsy(job.status.rejected || job.status.pending);
  t.is(job.result, 42);

});
test('Job should create a single job that throws an error and run it', async t => {

  t.plan(8);

  let flag = false;

  let job = new Job('some test', async (progress) => {
    await timeout(250);
    t.falsy(flag);
    flag = true;
    throw new Error('1337');
  }).run();

  await timeout(50);

  t.is(job.status.string, 'pending');
  t.truthy(job.status.pending);
  t.falsy(job.status.rejected || job.status.fulfilled);

  await timeout(300);

  t.is(job.status.string, 'failed');
  t.truthy(job.status.rejected);
  t.falsy(job.status.fulfilled || job.status.pending);
  t.is(job.result.message, '1337');

});

test('valid HTTP endpoint which returns an updated job status', async t => {
  let flag = false;

  t.plan(3);
  let job = Controller.add('test', async (progress) => {
    await timeout(250);
    t.falsy(flag);
    flag = true;
    throw new Error('1337');
  });

  await timeout(50);

  let res = await request.get('/v1/jobs/' + job).expect(200);
  // console.log('res', res.body);
  t.is(res.body.data.job_status, 'pending');

  await timeout(300);

  res = await request.get('/v1/jobs/' + job).expect(200);
  t.is(res.body.data.job_status, 'failed');

});


test('return 404 when job not found', async t => {
  let res = await request.get('/v1/jobs/1337').expect(404);
  // console.log(res.body);
  t.is(res.body.data.error_code, 'EJOBNOTFOUND');

})

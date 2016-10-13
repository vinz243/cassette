import test from 'ava';

import {Job, Controller} from '../../../src/server/models/job';


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

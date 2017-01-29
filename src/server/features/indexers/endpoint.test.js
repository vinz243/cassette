// Only real world test here...

import test from 'ava';
import config from '../../../../config';

import supertest from 'supertest-as-promised';
import app from '../../server.js';
import {pull, push} from '../store/database.js';
const request = supertest(app);

test('should throw 404 for unknown id', async t => {
  let res = await request.get('/v1/store/1337/releases');
  t.is(res.status, 404);
});

// if (config.pthPassword && config.pthUsername) {
//   test('should fetch results for Led Zeppelin', async t => {
//     let id = push({name: 'Led Zeppelin IV'});
//     let res = await request.get(`/v1/store/${id}/releases`);
//     console.log(res.error, res.body);
//   });
// }

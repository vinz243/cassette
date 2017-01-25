import supertest from 'supertest-as-promised';
import path from 'path';
import app from '../../server.js';

import test from 'ava';
import RecursiveIterator from 'recursive-iterator';

const request = supertest(app);

let recursiveKeys = (obj) => {
  let keys = []
  for(let {node, path} of new RecursiveIterator(obj)) {
    keys.push(path.join('.'));
  }
  return keys;
};

test('support querying album or track', async t => {
  let res = await request.post('/v1/store/searches').send({
    query: 'Stairway to Heaven',
    limit: 3
  });
  t.deepEqual(recursiveKeys(res.body), [ 'data',
    'data.albums',
    'data.albums.0',
    'data.albums.0.album',
    'data.albums.0.artist',
    'data.albums.0.id',
    'data.albums.0.type',
    'data.albums.1',
    'data.albums.1.album',
    'data.albums.1.artist',
    'data.albums.1.id',
    'data.albums.1.type',
    'data.albums.2',
    'data.albums.2.album',
    'data.albums.2.artist',
    'data.albums.2.id',
    'data.albums.2.type',
    'data.tracks',
    'data.tracks.0',
    'data.tracks.0.artist',
    'data.tracks.0.id',
    'data.tracks.0.track',
    'data.tracks.0.type',
    'data.tracks.1',
    'data.tracks.1.artist',
    'data.tracks.1.id',
    'data.tracks.1.track',
    'data.tracks.1.type',
    'data.tracks.2',
    'data.tracks.2.artist',
    'data.tracks.2.id',
    'data.tracks.2.track',
    'data.tracks.2.type',
    'payload',
    'payload.body',
    'payload.body.limit',
    'payload.body.query',
    'sucess' ]);
});

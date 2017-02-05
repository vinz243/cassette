import {Album, Artist}  from '../../models';
import {Magic} from 'mmmagic';
import app from '../../server.js';
import test from 'ava';
import supertest from 'supertest-as-promised';

const request = supertest(app);

test('works for an album', async t => {
  // t.plan(1);
  const artist = new Artist('System of A Down');
  await artist.create();

  const album = new Album({
    name: 'Toxicity',
    artistId: artist.data._id
  });
  await album.create();

  let buffer = await request.get(`/v1/albums/${album._id}/art`)
    .buffer()
    .expect(200);

  let magic = new Magic();

  magic.detect(buffer.body, (err, res) => {
    t.not(err);
    t.is(res, 'PNG image data, 300 x 300, 8-bit/color RGBA, non-interlaced');
  });
});

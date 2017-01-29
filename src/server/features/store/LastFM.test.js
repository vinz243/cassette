import test from 'ava';
import sampleTrack from './sample-track-results';
import sampleAlbum from './sample-album-results';
import LastFM from './LastFM';
import RecursiveIterator from 'recursive-iterator';
import omit from 'lodash/omit';
let lastFM = new LastFM();

let recursiveKeys = (obj) => {
  let keys = []
  for(let {node, path} of new RecursiveIterator(obj)) {
    keys.push(path.join('.'));
  }
  return keys;
};

test('searching palm trees yields sample\'s skeleton', async t => {
  let res = await lastFM.searchTrack('flatbush palm trees', 2);
  t.deepEqual(recursiveKeys(res), recursiveKeys(sampleTrack));
});

test('parses sample track data', async t => {
  let res = (await Promise.resolve(sampleTrack).then(LastFM.parseResult)).map(d => {
    return omit(d, ['id', 'mbid']);
  });
  t.deepEqual(res, [ { type: 'track',
    track: 'Palm Trees (Prod. By Erick Arc Elliott)',
    artist: 'Flatbush ZOMBiES'},
  { type: 'track',
    track: 'Palm Trees',
    artist: 'Flatbush ZOMBiES'}]);
});

test('parses sample album data', async t => {
  let res = (await Promise.resolve(sampleAlbum).then(LastFM.parseResult)).map(d => {
    return omit(d, ['id', 'mbid']);
  });
  t.deepEqual(res, [ { type: 'album',
    album: 'Better Off Dead',
    artist: 'Sodom' },
  { type: 'album',
    album: 'Better Off DEAD',
    artist: 'Flatbush ZOMBiES' } ]);
});

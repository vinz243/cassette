import test from 'ava';
import sampleTrack from './sample-track-results';
import LastFM from './LastFM';
import RecursiveIterator from 'recursive-iterator';

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

test('parses sample data', async t => {
  let res = await Promise.resolve(sampleTrack).then(LastFM.parseResult);
  t.deepEqual(res, [ { type: 'track',
    album: 'Palm Trees (Prod. By Erick Arc Elliott)',
    artist: 'Flatbush ZOMBiES' },
  { type: 'track',
    album: 'Palm Trees',
    artist: 'Flatbush ZOMBiES' } ]);
});

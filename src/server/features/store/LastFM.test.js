import test from 'ava';
import sampleTrack from './sample-track-results';
import sampleAlbum from './sample-album-results';
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

test('parses sample track data', async t => {
  let res = await Promise.resolve(sampleTrack).then(LastFM.parseResult);
  t.deepEqual(res, [ { type: 'track',
    track: 'Palm Trees (Prod. By Erick Arc Elliott)',
    artist: 'Flatbush ZOMBiES',
    id: 'lastfm:mbid:'},
  { type: 'track',
    track: 'Palm Trees',
    artist: 'Flatbush ZOMBiES',
    id: 'lastfm:mbid:24c4e06b-55df-49d3-ae59-06b24854860b' } ]);
});

test('parses sample album data', async t => {
  let res = await Promise.resolve(sampleAlbum).then(LastFM.parseResult);
  t.deepEqual(res, [ { id: 'lastfm:mbid:0fcef195-a29d-3c23-b2a8-30c7a2524c0d',
    type: 'album',
    album: 'Better Off Dead',
    artist: 'Sodom' },
  { id: 'lastfm:mbid:',
    type: 'album',
    album: 'Better Off DEAD',
    artist: 'Flatbush ZOMBiES' } ]);
});

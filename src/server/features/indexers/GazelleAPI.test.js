import test from 'ava';
import GazelleAPI from './GazelleAPI';
import sample from './sample-pth-query';

test('should parse correctly release', t => {
  let rel = GazelleAPI.toRelease({
    "groupId": 2929,
    "groupName": "Led Zeppelin IV",
    "artist": "Led Zeppelin",
    "cover": "https://ptpimg.me/66e40s.jpg",
    "groupYear": 1971,
    "releaseType": "Album",
    "torrentId": 15595,
    "encoding": "Lossless",
    "format": "FLAC",
    "hasLog": true,
    "seeders": 28,
    "leechers": 0,
  });
  t.is(rel.album, 'Led Zeppelin IV');
  t.is(rel.lossless, true);
  t.is(rel.freeleech, undefined);
  t.is(rel.format, 'FLAC');
  t.is(rel.hasLog, true);
  t.is(rel.torrentId, 15595);
  t.is(rel.artist, 'Led Zeppelin');
  t.is(rel.seeders, 28);
});

test('should parse torrents correctly', async t => {
  let res = await GazelleAPI.parseTorrents(sample);
  t.is(res.length, 5);
  t.is(res[0].artist, 'Led Zeppelin');
});

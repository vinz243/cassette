import test from 'ava';
import Release from './Release';

test('score should detect vbr', t => {
  let rel = new Release({
    format: 'V9 (VBR)',
  }, {
    vbrBonus: 1337,
  });
  t.is(rel.score, 1337);
});

test('score should parse correctly VBR', t => {
  let rel = new Release({
    format: 'V8 (VBR)'
  }, {
    vbrBonus: 0,
    bitrateTreshold: 1,
    bitrateMultiplier: 10,
    vbrBitrates: {
      V8: 2
    }
  });
  t.is(rel.score, 10)
});

test('score should malus for unkown format', t => {
  let rel = new Release({
    format: 'ogg'
  });
  t.deepEqual(rel.scores, [{
    amount: -200,
    desc: 'UNKNOWN_FORMAT'
  }]);
});

test('score should bonus for lossless', t => {
  let rel = new Release({
    format: 'Flac'
  });
  t.deepEqual(rel.scores, [{
    amount: 50,
    desc: 'FORMAT'
  }, {
    amount: 100,
    desc: 'LOSSLESS_BONUS'
  }]);
});

test('score should check for logs', t => {
  let rel = new Release({
    hasLog: true,
    format: 'mp3'
  }, {hasLogBonus: 42});

  t.is(rel.score, 42);

  t.is(new Release({
    hasLog: false,
    format: 'mp3'
  }, {hasLogBonus: 42}).score, 0);
  t.is(new Release({
    hasLog: undefined,
    format: 'mp3'
  }, {hasLogBonus: 42}).score, 0);
  t.is(new Release({
    format: 'mp3'
  }, {hasLogBonus: 42}).score, 0);
});

test('score should malus for no seeders', t => {
  let rel = new Release();
  rel.seeders = 0;
  t.is(rel.score, -400);
});

test('score should compute according to seeders', t => {
  let rel = new Release({seeders: 1}, {
    seedersParams: {
      xOffset: -4,
      xCoefficient: 1.2,
      amplitude: 150,
      noSeeders: -200
    },
    formats: {
      'unknown': 0
    },
  });
  t.is(rel.score, 9);
  rel.seeders = 8;
  t.is(rel.score, 150);
});

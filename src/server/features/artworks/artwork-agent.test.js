import {fetchArtistArtworkFactory} from './artwork-agent';
import querystring from 'qs';
import originalMd5 from 'md5';
import config from '../../config.js';

import sinon from 'sinon';
import fsp from 'fs-promise';
import req from 'request-promise-native';
import paf from 'path'
import finger from 'touch';
import assert from 'assert';
import test from 'ava';

assert(process.env.NODE_ENV === 'test', 'Environement must be test');

function spyify (module) {
  return Object.assign(typeof module === 'function' ? sinon.spy(module) : {},
    ...Object.keys(module).map(key => ({
      [key]: typeof module[key] === 'function' ? sinon.spy(module[key]) : module[key]
    }))
  );
}

function createSpies () {
  const fs = spyify(fsp);
  const path = spyify(paf);
  const touch = spyify(finger);
  const request = spyify(req);
  const qs = spyify(querystring);
  const md5 = sinon.spy(str => `{${str}}`);
  const fetch = fetchArtistArtworkFactory(fs, path, touch, request, qs, md5, config);
  return {
    fs, path, touch, request, qs, md5, fetch
  };
}

config.set('lastFMAPIKey', '85d5b036c6aa02af4d7216af592e1eea');

test('fetchArtistArtwork - resolves immediately if no artist',
  async t => {
  const spies = createSpies();
  await spies.fetch();
  t.false(spies.md5.called);
  t.false(spies.touch.called);
  t.false(spies.qs.stringify.called);
  await spies.fetch('');
  t.false(spies.md5.called);
  t.false(spies.touch.called);
  t.false(spies.qs.stringify.called);
});

test('fetchArtistArtwork - resolves immediately if file exists', async t => {
  const spies = createSpies();
  const exists = sinon.spy(p => true);
  const fetch = fetchArtistArtworkFactory(Object.assign({}, spies.fs, {
    existsSync: exists
  }), spies.path, spies.touch, spies.request, spies.qs, spies.md5, spies.config);
  await fetch('System of A Down');
  t.deepEqual(exists.args, [
    [paf.join(config.get('configPath'),
      'artworks/{entity=artist_artwork&artist=System%20of%20A%20Down}')]
  ]);
  t.false(spies.touch.sync.called);
  t.true(spies.qs.stringify.calledOnce);
  t.false(spies.request.called);
});

test('fetchArtistArtwork - fetch the correct url', async t => {
  const spies = createSpies();
  await spies.fetch('The Underachievers');
  t.deepEqual(spies.request.args[0], [
    'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' +
      '85d5b036c6aa02af4d7216af592e1eea&artist=The%20Underachievers&format=json'
  ]);
});

test('fetchArtistArtwork - resolves if no artworks found', async t => {
  const spies = createSpies();
  const request = sinon.spy(p => Promise.resolve(JSON.stringify({artist: {image: []}})));
  const fetch = fetchArtistArtworkFactory(spies.fs, spies.path, spies.touch,
    request, spies.qs, spies.md5, spies.config);
  await fetch('Flatbush Zombies');

  t.deepEqual(request.args, [[
    'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' +
      '85d5b036c6aa02af4d7216af592e1eea&artist=Flatbush%20Zombies&format=json'
  ]]);
});

test('fetchArtistArtwork - resolves if artist doesn\'t exists', async t => {
  const spies = createSpies();
  await spies.fetch('0x2A');
  t.deepEqual(spies.request.args, [[
    'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' +
      '85d5b036c6aa02af4d7216af592e1eea&artist=0x2A&format=json'
  ]]);
});

test('fetchArtistArtwork - fetch the largest image', async t => {
  const spies = createSpies();
  await spies.fetch('ASAP');
  t.deepEqual(spies.request.args[0], [
    'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' +
      '85d5b036c6aa02af4d7216af592e1eea&artist=ASAP&format=json'
  ]);
  t.true(spies.request.args[1][0].url.startsWith(
    'https://lastfm-img2.akamaized.net/i/u/300x300/'
  ));
  t.is(spies.request.args[1][0].encoding, null);
});

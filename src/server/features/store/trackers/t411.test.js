const test        = require('ava');
const sinon       = require('sinon');
const t411        = require('./t411');
const request     = require('request-promise-native');
const torrent     = require('../models/torrent');
const tracker     = require('../models/tracker');
const WantedAlbum = require('../models/wanted-album');

const trackerProps = {
  name: 'T411',
  type: 't411',
  host: 't411.ch',
  username: 'foo',
  password: 'bar',
  _id: 1337
};

test('t411 - authentificate user', async t => {
  const req = {
    post: sinon.spy(() => Promise.resolve({
      'uid': '1337',
      'token':'1337:42:133742'
    }))
  };
  const api = await t411(req, {props: trackerProps});
  t.is(typeof api.searchReleases, 'function');

  t.deepEqual(req.post.args, [
    ['https://api.t411.ch/auth', {form: {
      username: 'foo',
      password: 'bar'
    }, json: true}]
  ]);
});

test('t411 - throws a remote error if couldn\'t login', async t => {
  const req = {
    post: sinon.spy(() => Promise.resolve({
      error: 'Wrong password',
      code: 107
    }))
  };
  const err = await t.throws(t411(req, {props: trackerProps}));

  t.is(err.message, 'Remote error: Wrong password');
  t.deepEqual(req.post.args, [
    ['https://api.t411.ch/auth', {form: {
      username: 'foo',
      password: 'bar'
    }, json: true}]
  ]);
});

test('searchReleases - creates the releases a search results', async t => {
  const req = Object.assign(sinon.spy(() => Promise.resolve({
    query: 'System+of+Down+Toxicity',
    offset: 0,
    limit: 10,
    total: '0',
    torrents: []
  })), {
    post: sinon.spy(() => Promise.resolve({
      'uid': '1337',
      'token':'1337:42:133742'
    }))
  });
  const api = await t411(req, {props: trackerProps});
  t.is(typeof api.searchReleases, 'function');

  const res = await api.searchReleases({props: {
    name: 'Toxicity',
    artist: 'System of A Down',
    _id: 42
  }});

  t.deepEqual(req.args, [[{
    url: 'https://api.t411.ch/torrents/search/System+of+A+Down+Toxicity?cid=623',
    json: true,
    headers: {
      Authorization: '1337:42:133742'
    }
  }]]);
})

test('searchReleases - creates the releases', async t => {
  const req = Object.assign(sinon.spy(() => Promise.resolve({
    query: 'System+of+Down+Toxicity',
    offset: 0,
    limit: 10,
    total: '5',
    torrents: [
      {
        id: '41',
        name: 'System Of A Down - Toxicity (2001) [MP3 320kbps] *oLi7*',
        category: '623',
        seeders: '53',
        leechers: '2',
        size: '108037920'
     }, {
        id: '43',
        name: 'System of a Down - 2001 - Toxicity  [flac24bit96kHz]',
        category: '623',
        seeders: '13',
        leechers: '1',
        size: '1053402563'
     }
   ]
  })), {
    post: sinon.spy(() => Promise.resolve({
      'uid': '1337',
      'token':'1337:42:133742'
    }))
  });
  const instance = tracker(Object.assign({}, trackerProps, {_id: undefined}));
  await instance.create();

  const api = await t411(req, instance);

  const wantedAlbum = WantedAlbum({
    name: 'Toxicity',
    artist: 'System of A Down',
    mbid: 'f50fbcb4-bfcd-3784-b4c9-44f4793e66b2',
    partial: false
  });
  await wantedAlbum.create();

  await api.searchReleases(wantedAlbum);

  const releases = await torrent.find({wanted_album: wantedAlbum.props._id});
  t.is(releases.length, 2);
});

const test        = require('ava');
const sinon       = require('sinon');
const gazelle     = require('./gazelle');
const request     = require('request-promise-native');
const torrent     = require('../models/torrent');
const tracker     = require('../models/tracker');
const WantedAlbum = require('../models/wanted-album');

const trackerProps = {
  name: 'PTH',
  type: 'gazelle',
  host: 'pth.com',
  username: 'foo',
  password: 'bar',
  _id: 1337
};

test('gazelle - authentificates user successfully with 302 status', async t => {
  const post = Promise.resolve.bind(Promise, {
    statusCode: 302
  });
  const request = {
    jar: sinon.spy(() => ({
      cookies: 42
    })),
    defaults: sinon.spy(() => ({
      post
    }))
  }

  await gazelle(request, {props: trackerProps});
  t.true(request.jar.calledOnce);
  t.deepEqual(request.defaults.args, [[{jar: {cookies: 42}}]])
});

test('gazelle - throws an error if does not redirects', async t => {
  const post = Promise.resolve.bind(Promise, {
    statusCode: 200
  });
  const request = {
    jar: sinon.spy(() => ({
      cookies: 42
    })),
    defaults: sinon.spy(() => ({
      post
    }))
  }

  await t.throws(gazelle(request, {props: trackerProps}));
  t.true(request.jar.calledOnce);
  t.deepEqual(request.defaults.args, [[{jar: {cookies: 42}}]])
});

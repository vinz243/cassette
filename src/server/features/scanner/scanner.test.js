import {
  titleCase,
  getMediastic,
  scan,
  operationMapperFactory
} from './scanner';
import test from 'ava';
import path from 'path';
import sinon from 'sinon';
import {find as findFile} from '../../models/File'
import {
  Library
} from '../../models/Library';

test('titleCase - change a group of word to title case', t => {
  t.is(titleCase('hello world'), 'Hello World');
  t.is(titleCase('hello, world'), 'Hello, World');
});

test('titleCase - doesn\'t change case for initials', t => {
  t.is(titleCase('PNL'), 'PNL');
  t.is(titleCase('NQNT 2'), 'NQNT 2');
  t.is(titleCase('P. O. D.'), 'P. O. D.');
  t.is(titleCase('P.O.D.'), 'P.O.D.');
  t.is(titleCase('J\'suis QLF'), 'J\'suis QLF');
});
test('operationMapper - creates or finds a new artist', async t => {
  let fileCreate = sinon.spy(() => Promise.resolve());
  let findOrCreateTrack = sinon.spy(() => Promise.resolve({
      props: {
        _id: '42'
      }
    })),
    findOrCreateAlbum = sinon.spy(() => Promise.resolve({
      props: {
        _id: '1337'
      }
    })),
    findOrCreateArtist = sinon.spy(() => Promise.resolve({
      props: {
        _id: '2a'
      }
    })),
    File = sinon.spy(() => ({
      props: {
        _id: '539'
      },
      create: fileCreate
    })),
    findFileById = sinon.spy(() => Promise.resolve({
      props: {
        _id: 'foo'
      }
    }));

  let mediastic = sinon.spy(() => Promise.resolve({
    artist: 'System of a Down',
    album: 'Toxicity',
    title: 'Chop Suey',
    track: 6,
    duration: 3 * 60 + 30,
    bitrate: 42
  }));
  await operationMapperFactory({
    findOrCreateTrack,
    findOrCreateAlbum,
    findOrCreateArtist,
    File,
    findFileById
  }, mediastic)(['create', '06 - foo', {
    basePath: '/foo',
    relativePath: '06 - foo'
  }]);
  t.truthy(findOrCreateArtist.calledOnce);
  t.deepEqual(findOrCreateArtist.args[0], [{
    name: 'System of a Down'
  }]);
  t.deepEqual(findOrCreateAlbum.args[0], [{
    name: 'Toxicity'
  }, {
    artist: '2a'
  }]);
  t.deepEqual(findOrCreateTrack.args[0], [{
    album: '1337',
    trackNumber: 6,
    name: 'Chop Suey'
  }, {
    artist: '2a',
    duration: 3 * 60 + 30,
  }]);
  t.deepEqual(File.args[0], [{
    path: '/foo/06 - foo',
    bitrate: 42,
    album: '1337',
    artist: '2a',
    duration: 210
  }]);
});

test('scan - works with directory', async t => {
  let folder = path.join(__dirname, '../../../../data/library');
  let library = Library({path: folder});
  await library.create();
  await scan(library.props._id);
  let [props] = (await findFile({bitrate: 158110})).map(el => el.props);
  t.deepEqual(props,{ duration: 297.900408,
    bitrate: 158110,
    path: path.join(folder, '/04 - Cleanin Out My Closet.mp3'),
    _id: props._id,
    album: { name: 'The Eminem Show', artist: props.artist._id, _id: props.album._id },
    artist: { name: 'Eminem', _id: props.artist._id }});
});
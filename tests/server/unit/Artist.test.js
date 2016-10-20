import {Artist} from '../../../src/server/models';

import test from 'ava';

test('creates a new Artist object with correct props', t => {
  let artist = new Artist('Alborosie');
  t.is(artist.name, 'Alborosie');
});

test('accepts db object', t => {
  let artist = new Artist({
    _id: '42',
    name: 'Alborosie',
    genre: 'Reggae'
  });
  t.is(artist._id, '42');
  t.is(artist.name, 'Alborosie');
  t.is(artist.genre, 'Reggae');
})

test('creates a new Artist and save it to db', async t => {
  let artist = new Artist('Alborosie');
  artist.genre = 'Reggae';

  let alborosie = await artist.create();
  t.is(alborosie.name, 'Alborosie');
  t.is(alborosie.genre, 'Reggae');
  t.not(alborosie._id, undefined);

  t.is(artist._id, alborosie._id);
});

test('creates an artist and fetch it by id', async t => {
  let eminem = new Artist('Eminem');
  eminem.genre = 'Rap';

  await eminem.create();

  let res = await Artist.getById(eminem._id);

  t.is(res[0].name, 'Eminem');
  t.is(res[0].genre, 'Rap');
  t.is(res.length, 1);
});

test('creates an artist and fetch it by name', async t => {
  let bustaRhymes = new Artist('Busta Rhymes');
  bustaRhymes.genre = 'Rap';

  await bustaRhymes.create();

  let res = await Artist.get({name: 'Busta Rhymes'});

  t.is(res[0].name, 'Busta Rhymes');
  t.is(res[0].genre, 'Rap');
  t.is(res.length, 1);
});


test('can fetch several artists', async t => {
  let foo = new Artist('Foo'), bar = new Artist('Bar');
  foo.genre = bar.genre = 'Foobar';

  await foo.create();
  await bar.create();

  let res = await  Artist.get({genre: 'Foobar'});

  t.is(res.length, 2);
  if(res[0]._id === foo._id) {
    t.is(res[0].name, 'Foo');
    t.is(res[1].name, 'Bar');
  } else {
    t.is(res[1].name, 'Foo');
    t.is(res[0].name, 'Bar');
  }
});

test('refuses empty queries', async t => {

  t.throws(Artist.get({}));
  t.throws(Artist.get({foo: 'bar'}));
});

test('refuses to create fetched artist', async t => {
  let foo = new Artist({
    name: 'test',
    genre: 'test',
    _id: '1337'
  });

  t.throws(foo.create());

});

test('refuses to create twice', async t => {

  let davodka = new Artist('Davodka');
  await davodka.create();

  t.throws(davodka.create());

});

test('refuses dup artists', async t => {
  let hugoTsr = new Artist('Hugo TSR');
  await hugoTsr.create();

  t.throws( (new Artist('Hugo TSR')).create());
});

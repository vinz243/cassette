import {Artist} from './index';

import test from 'ava';

test('creates a new Artist object with correct props', t => {
  let artist = new Artist('Alborosie');
  t.is(artist.data.name, 'Alborosie');
});

test('accepts db object', t => {
  let artist = new Artist({
    _id: '42',
    name: 'Alborosie',
    genre: 'Reggae'
  });
  t.is(artist._id, '42');
  t.is(artist.data.name, 'Alborosie');
  t.is(artist.data.genre, 'Reggae');
})

test('creates a new Artist and save it to db', async t => {
  let artist = new Artist('Alborosie');
  artist.data.genre = 'Reggae';

  await artist.create();
  t.not(artist._id, undefined);
});

test('creates an artist and fetch it by id', async t => {
  let eminem = new Artist('Eminem');
  eminem.data.genre = 'Rap';

  await eminem.create();

  let res = await Artist.findById(eminem._id);

  t.is(res.data.name, 'Eminem');
  t.is(res.data.genre, 'Rap');
});

test('creates an artist and fetch it by name', async t => {
  let bustaRhymes = new Artist('Busta Rhymes');
  bustaRhymes.data.genre = 'Rap';

  await bustaRhymes.create();

  let res = await Artist.find({name: 'Busta Rhymes'});

  t.is(res[0].data.name, 'Busta Rhymes');
  t.is(res[0].data.genre, 'Rap');
  t.is(res.length, 1);
});


test('can fetch several artists', async t => {
  let foo = new Artist('Foo'), bar = new Artist('Bar');
  foo.data.genre = bar.data.genre = 'Foobar';

  await foo.create();
  await bar.create();

  let res = await  Artist.find({genre: 'Foobar'});

  t.is(res.length, 2);
  if(res[0]._id === foo._id) {
    t.is(res[0].data.name, 'Foo');
    t.is(res[1].data.name, 'Bar');
  } else {
    t.is(res[1].data.name, 'Foo');
    t.is(res[0].data.name, 'Bar');
  }
});

// test('refuses empty queries', async t => {
//
//   t.throws(Artist.find({}));
//   t.throws(Artist.find({foo: 'bar'}));
// });

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

// test('refuses dup artists', async t => {
//   let hugoTsr = new Artist('Hugo TSR');
//   await hugoTsr.create();
//
//   t.throws( (new Artist('Hugo TSR')).create());
// });

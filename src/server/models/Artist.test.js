const {Artist, findOne, findById, find} = require('./Artist');

const test = require("ava");

test('creates a new Artist object with correct getProps()', t => {
  let artist = Artist({name: 'Alborosie'});
  t.is(artist.getProps().name, 'Alborosie');
});

test('accepts db object', t => {
  let artist = Artist({
    _id: '42',
    name: 'Alborosie',
    genre: 'Reggae'
  });
  t.is(artist.getProps()._id, '42');
  t.is(artist.props.name, 'Alborosie');
  t.is(artist.getProps().genre, 'Reggae');
})

test('creates a new Artist and save it to db', async t => {
  let artist = Artist('Alborosie');
  artist.getProps().genre = 'Reggae';

  await artist.create();
  t.not(artist.getProps()._id, undefined);
});

test('creates an artist and fetch it by id', async t => {
  let eminem = Artist({
    name: 'Eminem',
    genre: 'Rap'
  });

  await eminem.create();

  let res = await findById(eminem.getProps()._id);

  t.is(res.getProps().name, 'Eminem');
  t.is(res.getProps().genre, 'Rap');
});

test('creates an artist and fetch it by name', async t => {
  let bustaRhymes = Artist({
    name: 'Busta Rhymes',
    genre: 'Rap'
  });

  await bustaRhymes.create();

  let res = await find({name: 'Busta Rhymes'});

  t.is(res[0].getProps().name, 'Busta Rhymes');
  t.is(res[0].getProps().genre, 'Rap');
  t.is(res.length, 1);
});


test('can fetch several artists', async t => {
  let foo = Artist({name: 'Foo', genre: 'Foobar'}),
    bar = Artist({name: 'Bar', genre: 'Foobar'});

  await foo.create();
  await bar.create();

  let res = await find({genre: 'Foobar'});

  t.is(res.length, 2);
  if(res[0].getProps()._id === foo.getProps()._id) {
    t.is(res[0].getProps().name, 'Foo');
    t.is(res[1].getProps().name, 'Bar');
  } else {
    t.is(res[1].getProps().name, 'Foo');
    t.is(res[0].getProps().name, 'Bar');
  }
});

// test('refuses empty queries', async t => {
//
//   t.throws(Artist.find({}));
//   t.throws(Artist.find({foo: 'bar'}));
// });

test('refuses to create fetched artist', async t => {
  let foo = Artist({
    name: 'test',
    genre: 'test',
    _id: '1337'
  });

  t.throws(foo.create());

});

test('refuses to create twice', async t => {

  let davodka = Artist('Davodka');
  await davodka.create();

  t.throws(davodka.create());

});

// test('refuses dup artists', async t => {
//   let hugoTsr = new Artist('Hugo TSR');
//   await hugoTsr.create();
//
//   t.throws( (new Artist('Hugo TSR')).create());
// });

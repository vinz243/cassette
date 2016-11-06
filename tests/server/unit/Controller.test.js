import Controller from '../../../src/server/controllers/Controller';
import Model from '../../../src/server/models/Model';

import test from 'ava';


test('Controller should map routes correctly', t => {
  let Person = new Model('person')
    .field('name')
    .done()
  .done();

  let routes = new Controller(Person).done();

  // console.log(routes);
  t.not(routes['/v1/people'].get, undefined);
  t.not(routes['/v1/people/:id'].get, undefined);
});


test('Controller should be able to query', async t => {
  let Pet = new Model('pet')
    .field('name')
      .string()
      .required()
      .done()
    .field('legs')
      .int()
      .done()
    .done();

  await (new Pet({name: 'cat', legs: 4})).create();
  await (new Pet({name: 'dog', legs: 4})).create();
  await (new Pet({name: 'mice', legs: 4})).create();

  let routes = new Controller(Pet).done();
  let ctx = {
    params: {}
  }

  await routes['/v1/pets'].get(ctx);
  t.is(ctx.body.length, 3);
  t.is(ctx.body.data.length, 3);
  t.is(ctx.body.status, 'success');

  ctx = {
    params:  {},
    query: {
      limit: 2
    }
  };

  await routes['/v1/pets'].get(ctx);
  t.is(ctx.body.length, 2, 'does not support limit parameter');
  t.is(ctx.body.data.length, 2);
  t.is(ctx.body.status, 'success');

  ctx = {
    params:  {},
    query: {
      limit: 42
    }
  };

  await routes['/v1/pets'].get(ctx);

  t.is(ctx.body.length, 3, 'does not support limit parameter');
  t.is(ctx.body.data.length, 3);
  t.is(ctx.body.payload.query.limit, 25,
    'does not set a maximum value for limit');
  t.is(ctx.body.status, 'success');
});
test('Controller should be able to find one by id', async t => {
  let Vehicule = new Model('vehicule')
    .field('name')
      .string()
      .required()
      .done()
    .field('wheels')
      .int()
      .done()
    .done();
  let car = new Vehicule({name: 'car', wheels: 4});
  await car.create();
  await (new Vehicule({name: 'moto', wheels: 2})).create();

  let routes = new Controller(Vehicule).done();

  let ctx = {
    params:  {
      id: car._id
    },
    query: {}
  };

  await routes['/v1/vehicules/:id'].get(ctx);

  t.is(ctx.body.data.wheels, 4);
  t.is(ctx.body.data.name, 'car');

  ctx = {
    params:  {
      id: '42'
    },
    query: {}
  };

  await routes['/v1/vehicules/:id'].get(ctx);

  t.is(ctx.status, 404);
  t.is(ctx.body.payload.params.id, '42');
});


test('should support searches', async t => {
  let Weapon = new Model('weapon')
    .field('name')
      .string()
      .required()
      .done()
    .field('type')
      .string()
      .done()
    .field('fireRate')
      .int()
      .done()
    .done();

  let ctrller = new Controller(Weapon).done();

  await (new Weapon({
    name: 'Famas',
    fireRate: 1000,
    type: 'AssaultRifle'
  })).create();
  await (new Weapon({
    name: 'AEK-971',
    fireRate: 900,
    type: 'AssaultRifle'
  })).create();
  await (new Weapon({
    name: 'M16A1',
    fireRate: 700,
    type: 'AssaultRifle'
  })).create();
  await (new Weapon({
    name: 'M16A2',
    fireRate: 700,
    type: 'AssaultRifle'
  })).create();
  await (new Weapon({
    name: 'M16A4',
    fireRate: 750,
    type: 'AssaultRifle'
  })).create();
  await (new Weapon({
    name: 'MK Mod 11',
    type: 'DMR'
  })).create();
  await (new Weapon({
    name: 'MK Mod 8',
    type: 'DMR'
  })).create();

  let ctx = {body: {}, request: {}};
  ctx.request.fields = {
    name: 'Famas'
  };

  let search = ctrller['/v1/weapons/searches'].post;

  await search(ctx);
  t.is(ctx.body.length, 1);
  t.is(ctx.body.data[0].fireRate, 1000);

  ctx.request.fields = {
    fireRate: 700
  };
  await search(ctx);
  t.is(ctx.body.length, 2);
  t.is(ctx.body.data[0].fireRate, 700)
  t.is(ctx.body.data[1].fireRate, 700)

  ctx.request.fields = {
    name: '/16A/'
  };
  await search(ctx);
  t.is(ctx.body.length, 3);
});


test('should support allowPost, put and del', async t => {
  let Object = new Model('object')
    .field('name').string().required().done().done();

  let routes = new Controller(Object)
    .allowPost().allowPut().allowDel().allowSearches()
  .done();

});

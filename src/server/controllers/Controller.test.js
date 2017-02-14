import {fetchable,
        createable,
        removeable,
        updateable,
        oneToMany} from './Controller';
import Model from '../models/Model';

import test from 'ava';
import sinon from 'sinon';

test('fetchable - fetch multiple document', async t => {
  let find = sinon.spy(() => Promise.resolve([{
    props: {
      name: 'Jon',
      sword: 'Longclaw'
    }
  }, {
    props: {
      name: 'Jon',
      sword: 'Oathkeeper'
    }
  }]));
  let ctx = {
    status: 42,
    body: 'foo',
    query: {
      limit: 2
    }
  }
  await fetchable('character', find)['/api/v2/characters'].get(ctx);
  t.is(ctx.status, 200);
  t.deepEqual(ctx.body, [{
    name: 'Jon',
    sword: 'Longclaw'
  }, {
    name: 'Jon',
    sword: 'Oathkeeper'
  }]);
  t.deepEqual(find.args[0], [{limit: 2}]);
});

test('fetchable - fetch one document', async t => {
  let findById = sinon.spy(() => Promise.resolve({props: {
    name: 'Ser Arthur Dayne',
    sword: 'Dawn'
  }}));

  let ctx = {
    params: {id: 1337}
  };
  await fetchable('character', null, findById)['/api/v2/characters/:id'].get(ctx);
  t.is(ctx.status, 200);
  t.deepEqual(ctx.body, {
    name: 'Ser Arthur Dayne',
    sword: 'Dawn'
  });
  t.deepEqual(findById.args[0], [1337]);
});

test('fetchable - return 404 when document not found', async t => {
  let findById = sinon.spy(() => Promise.resolve());
  let throws = sinon.spy();
  let ctx = {
    params: {id: 42},
    throws
  };
  await fetchable('character', null, findById)['/api/v2/characters/:id'].get(ctx);

  t.deepEqual(throws.args[0], [404, 'Object not found in database']);
  t.deepEqual(findById.args[0], [42]);
});

test('creatable - create an object from fields', async t => {
  let create = sinon.spy(() => Promise.resolve());
  let model = sinon.spy((props) => ({
    props: Object.assign({}, props, {_id: 42}),
    create
  }));
  let ctx = {
    request: {
      fields: {
        name: 'Ser Ulrick Dayne',
        sword: 'Dawn'
      }
    }
  }
  await createable('character', model)['/api/v2/characters'].post(ctx);

  t.is(ctx.status, 201);
  t.deepEqual(ctx.body, {
    _id: 42,
    name: 'Ser Ulrick Dayne',
    sword: 'Dawn'
  });
  t.deepEqual(create.args, [[]]);
  t.deepEqual(model.args[0], [{
    name: 'Ser Ulrick Dayne',
    sword: 'Dawn'
  }]);
});

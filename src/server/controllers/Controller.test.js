import {fetchable} from './Controller';
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
})

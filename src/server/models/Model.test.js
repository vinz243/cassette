import {
    assignFunctions,
    defaultFunctions,
    manyToOne,
    legacySupport,
    updateable,
    createable
  } from './Model';
import test from 'ava';
import sinon from 'sinon';

test('assignFunctions - should assign for normal object', t => {
  let obj = {
    foo: 'bar',
    number: 42,
    nested: {
      otherNumber: 1337
    },
    otherNested: {
      anwser: 'still 42',
      sub: {
        marine: 'true' // lol
      }
    }
  }
  t.deepEqual(assignFunctions({}, obj, {
    foo: 'baz',  nested: {  notANumber: NaN  }
  }, {
    rule: 34
  }), {
    foo: 'baz',  number: 42, nested: {  notANumber: NaN  },
    rule: 34,  otherNested: {
      anwser: 'still 42',
      sub: {  marine: 'true'  }
    }
  });
  t.deepEqual(obj, {
    foo: 'bar', number: 42, nested: {  otherNumber: 1337},
    otherNested: {anwser: 'still 42', sub: {  marine: 'true' }}
  });
});

test('assignFunction - should stack post (sync)', t => {
  let object = {
    update: (up) => {
      return 'update';
    }
  };
  let src = {
    postUpdate: (res) => {
      return res + ' post';
    }
  };
  let src2 = {
    postUpdate: (res) => {
      return res + ' past';
    }
  };
  let obj = assignFunctions({}, object, src, src2);
  t.is(obj.update(), 'update post past');
});

test('assignFunctions - should stack post async', async t => {
  const delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };
  const resolveAfter = (str, ms) => delay(ms).then(Promise.resolve.bind(Promise, str));

  let object = {
    update: (up) => {
      return resolveAfter('update', 20);
    }
  };
  let src = {
    postUpdate: (res) => {
      return resolveAfter(res + ' post', 20);
    }
  };
  let src2 = {
    postUpdate: (res) => {
      return resolveAfter(res + ' past', 20);
    }
  };
  let obj = assignFunctions({}, object, src, src2);
  t.is(await obj.update(), 'update post past');
});

test('defaultFunctions - returns standard failing function', t => {
  let obj = defaultFunctions({});
  t.truthy(obj.update);
  t.truthy(obj.set);
  t.truthy(obj.create);
  t.truthy(obj.remove);
  t.throws(() => obj.update());
  t.throws(() => obj.set());
  t.throws(() => obj.create());
  t.throws(() => obj.remove());
});

test('manyToOne - assigns to passed props populated values', t => {
  let state = {
    populated: {
      sibling: {
        name: 'Bruce',
        sex: 'Male'
      }
    }
  };
  let props = manyToOne(state, 'sibling');
  let res = props.postGetProps({siblingId: 'id', name: 'Thomas'});
  t.deepEqual(res, {
    name: 'Thomas',
    sibling: {
      name: 'Bruce',
      sex: 'Male'
    }
  });
});

test('manyToOne - calls db find and mutate populated values', async t => {
  let called = false;
  let state = {
    populated: {},
    _props: {
      fooId: 42
    }
  };
  let props = manyToOne(state, 'foo', () => ({
    find: (q) => {
      t.deepEqual(q, {_id: 42});
      called = true;
      return Promise.resolve({foo: 'bar', _id: 42});
  }}));
  await props.postPopulate();
  t.truthy(called);
  t.deepEqual(state.populated, {
    foo: {foo: 'bar', _id: 42}
  });
});

test('legacySupport - calls getProps', t => {
  let state = {
    functions : {
      getProps: () => ({answer: 42})
    }
  };
  t.deepEqual(legacySupport(state).data, {answer: 42});
});

test('updateable - update calls db.update', async t => {
  let callback = sinon.spy();
  let state = {
    _props: {
      _id: 1337,
      number: 42,
      foo: 'bar'
    },
    dirty: true
  };
  updateable(state, {update: callback}).update();
  t.truthy(callback.called);
  t.truthy(callback.calledWith({_id: 1337}, {
    _id: 1337,
    number: 42,
    foo: 'bar'
  }));
});

test('updateable - set mutate props', t => {
  let state = {
    _props: {
      _id: 1337,
      value: 42
    },
    fields: ['value']
  };
  updateable(state, {}).set('value', 'foo');
  t.deepEqual(state._props, {
      _id: 1337,
      value: 'foo'
  });
});

test('createable - calls db.create', async t => {
  let state = {
    _props: {
      number: 42,
      foo: 'bar'
    }
  };
  let callback = sinon.spy(function () {
    return Promise.resolve({
      _id: 1337,
      number: 42,
      foo: 'bar'
    });
  });
  await createable(state, {insert: callback}).create();
  t.truthy(callback.called);
  t.truthy(callback.calledWith({
    number: 42,
    foo: 'bar'
  }));
  t.deepEqual(state._props, {
    _id: 1337,
    number: 42,
    foo: 'bar'
  });
});

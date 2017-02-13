import {
    assignFunctions,
    defaultFunctions,
    manyToOne,
    legacySupport,
    updateable,
    createable,
    removeable,
    databaseLoader,
    publicProps,
    findOneFactory
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

test('assignFunctions - shoudl support getters', t => {
  let answer = 41;
  t.is(assignFunctions({}, {
    get foo() {
      return answer + 1
    }
  }).foo, 42)
})

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
  // let getDB = sinon.spy(() => ({
  //   findOne: (doc, cb) => {
  //     cb()
  //   }
  // }))
  let props = manyToOne(state, 'sibling');

  let res = props.postGetProps({sibling: 'id', name: 'Thomas'});
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
    props: {
      foo: 42
    }
  };
  let props = manyToOne(state, 'foo', () => ({
    findOne: (q, p, cb) => {
      t.deepEqual(q, {_id: 42});
      called = true;
      return cb(null, {foo: 'bar', _id: 42});
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
    props: {
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
    props: {
      _id: 1337,
      value: 42
    },
    fields: ['value']
  };
  updateable(state, {}).set('value', 'foo');
  t.deepEqual(state.props, {
      _id: 1337,
      value: 'foo'
  });
});

test('createable - calls db.insert', async t => {
  let state = {
    props: {
      number: 42,
      foo: 'bar'
    }
  };
  let callback = sinon.spy(function (doc, cb) {
    return cb(null, [{
      _id: 1337,
      number: 42,
      foo: 'bar'
    }]);
  });
  await createable(state, {insert: callback}).create();
  t.truthy(callback.called);
  t.truthy(callback.calledWith({
    number: 42,
    foo: 'bar'
  }));
  t.deepEqual(state.props, {
    _id: 1337,
    number: 42,
    foo: 'bar'
  });
});

let character = null,
    weapon = null,
    gandalf = {
      name: 'Gandalf The White',
      race: 'Wizard'
    },
    aragorn = {
      name: 'Aragorn',
      race: 'Human'
    },
    merry = {
      name: 'Merry',
      race: 'Hobbit'
    },
    pippin = {
      name: 'Pippin',
      race: 'Hobbit'
    },
    gandalfStaff = {
      type: 'staff',
    },
    anduril = {
      name: 'Andùril',
      type: 'Sword'
    };

test.serial('integration - create the models', t => {
  weapon = function(props) {
    if (typeof props === 'string') {
      props = {
        name: props
      };
    }
    let state = {
      name: 'weapon',
      fields: ['name', 'type'],
      functions: {},
      populated: {},
      props
    };
    return assignFunctions(
      state.functions,
      defaultFunctions(state),
      updateable(state),
      createable(state),
      removeable(state),
      databaseLoader(state),
      publicProps(state),
      legacySupport(state)
    );
  };

  character = function(props) {
    if (typeof props === 'string') {
      props = {
        name: props
      };
    }
    let state = {
      name: 'character',
      fields: ['name', 'weapon', 'race', 'age'],
      functions: {},
      populated: {},
      props: Object.assign(props)
    };
    return assignFunctions(
      state.functions,
      defaultFunctions(state),
      updateable(state),
      createable(state),
      removeable(state),
      databaseLoader(state),
      publicProps(state),
      legacySupport(state),
      manyToOne(state, 'weapon')
    );
  };
});

test.serial('integration - create the characters', async t => {
  let staff = weapon(Object.assign(gandalfStaff));
  let aragornSword = weapon(Object.assign(anduril));

  await Promise.all([staff.create(), aragornSword.create()]);
  anduril._id = aragornSword.props._id;
  gandalfStaff._id = staff.props._id;

  t.deepEqual(anduril, aragornSword.props);
  t.deepEqual(gandalfStaff, staff.props);
  gandalf.weapon = gandalfStaff._id;

  let mithrandir = character(Object.assign({}, gandalf));
  await mithrandir.create();
  gandalf._id = mithrandir.props._id;

  t.deepEqual(mithrandir.props, gandalf);
  t.truthy(gandalf._id);

  aragorn.weapon = anduril._id;
  let ranger = character(Object.assign({}, aragorn));
  await ranger.create();
  aragorn._id = ranger.props._id;

  t.deepEqual(ranger.props, aragorn);
  t.truthy(aragorn._id);

  let [meriadoc, peregrin] = [merry, pippin].map(character);
  await Promise.all([meriadoc, peregrin].map(hobbit => hobbit.create()));
  pippin._id = peregrin.props._id;
  merry._id = meriadoc.props._id;

  t.deepEqual([peregrin, meriadoc].map(hobbit => hobbit.props), [pippin, merry]);
});

test.serial('integration - findOne by _id', async t => {
  let findOneCharacter = findOneFactory(character);

  let mithrandir = await findOneCharacter({_id: gandalf._id});
  t.is(mithrandir.props.name, 'Gandalf The White');
  t.deepEqual(mithrandir.props, Object.assign({}, gandalf, {
    weapon: gandalfStaff
  }));
});

test.serial('integration - findOne by name', async t => {
  let findOneCharacter = findOneFactory(character);

  let meriadoc = await findOneCharacter({name: merry.name});
  t.is(meriadoc.props.name, 'Merry');
  t.deepEqual(meriadoc.props, Object.assign({}, merry));

  let peregrin = await findOneCharacter({name: pippin.name});
  t.is(peregrin.props.name, 'Pippin');
  t.deepEqual(peregrin.props, Object.assign({}, pippin));
});

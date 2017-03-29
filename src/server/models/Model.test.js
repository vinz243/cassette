const {
    assignFunctions,
    defaultFunctions,
    manyToOne,
    legacySupport,
    updateable,
    createable,
    removeable,
    databaseLoader,
    publicProps,
    findOneFactory,
    findFactory,
    findOrCreateFactory,
    defaultValues,
    validator,
    enforce
  } = require('./Model');

const test = require("ava");
const sinon = require("sinon");

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


test('assignFunctions - should stack pre sync', t => {
  let obj = {
    foo: (...args) => {
      return args.map(str => str.split('').reverse().join(''));
    }
  };
  t.deepEqual(obj.foo('beep', 'flop', 'pop'), ['peeb', 'polf', 'pop']);
  let hook1 = {
    preFoo: (beep, flip, pop) => {
      return [`bop ${beep}`, `flop ${flip}`, `pop`];
    }
  }
  let hook2 = {
    preFoo: (bop, flop, pop) => {
      return [`beep ${bop}`, `flip ${flop}`, `pop`];
    }
  }
  let object = assignFunctions({}, obj, hook2, hook1);
  let res = object.foo('beep', 'flip', 'pot');
  t.deepEqual(res, ['peeb pob peeb', 'pilf polf pilf', 'pop']);
});

test('assignFunctions - should stack pre sync with async function', async t => {
  const delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  let obj = {
    foo: async (...args) => {
      await delay(100);
      return args.map(str => str.split('').reverse().join(''));
    }
  };
  let hook1 = {
    preFoo: ((beep, flip, pop) => {
      return [`bop ${beep}`, `flop ${flip}`, `pop`];
    })
  }
  let hook2 = {
    preFoo: ((bop, flop, pop) => {
      return [`beep ${bop}`, `flip ${flop}`, `pop`];
    })
  }
  let object = assignFunctions({}, obj, hook2, hook1);
  let res = await object.foo('beep', 'flip', 'pot');
  t.deepEqual(res, ['peeb pob peeb', 'pilf polf pilf', 'pop']);

});
test('assignFunctions - should stack pre async with async function', async t => {
  const delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  let obj = {
    foo: async (...args) => {
      await delay(100);
      return args.map(str => str.split('').reverse().join(''));
    }
  };
  let hook1 = {
    preFoo: async (beep, flip, pop) => {
      await delay(100);
      return [`bop ${beep}`, `flop ${flip}`, `pop`];
    }
  }
  let hook2 = {
    preFoo: async (bop, flop, pop) => {
      await delay(100);
      return [`beep ${bop}`, `flip ${flop}`, `pop`];
    }
  }
  let object = assignFunctions({}, obj, hook2, hook1);
  let res = await object.foo('beep', 'flip', 'pot');
  t.deepEqual(res, ['peeb pob peeb', 'pilf polf pilf', 'pop']);
});
test('assignFunctions - should support both pre and post hook', async t => {
  const delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  const obj = {
    foo: async (...args) => {
      await delay(100);
      return args.map(str => str.split('').reverse().join(''));
    }
  };
  const hook1 = {
    preFoo: async (beep, flip, pop) => {
      await delay(100);
      return [`bop ${beep}`, `flop ${flip}`, `pop`];
    }
  }
  const hook2 = {
    postFoo: async ([bop, flop, pop]) => {
      await delay(100);
      return [`beep ${bop}`, `flip ${flop}`, `pop`];
    }
  }
  const object1 = assignFunctions({}, obj, hook1, hook2);
  const object2 = assignFunctions({}, obj, hook2, hook1);
  const res1 = await object1.foo('beep', 'flip', 'pot');
  const res2 = await object2.foo('beep', 'flip', 'pot');
  t.deepEqual(res1, [ 'beep peeb pob', 'flip pilf polf', 'pop' ])
  t.deepEqual(res2, [ 'beep peeb pob', 'flip pilf polf', 'pop' ])
});

test('assignFunctions - does not call core if error raised', async t => {
  const delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  const obj = {
    foo: sinon.spy(async (...args) => {
      await delay(100);
      return args.map(str => str.split('').reverse().join(''));
    })
  };
  const hook1 = {
    preFoo: async (beep, flip, pop) => {
      await delay(100);
      throw new Error('Oops, something wrong happened');
    }
  }
  const object = assignFunctions({}, obj, hook1);
  t.throws(object.foo('beep', 'flip', 'pot'));
  t.false(obj.foo.called);
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
    },
    frodo = {
      name: 'Frodo',
      race: 'Hobbit'
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

test.serial('integration - findOne non existing document', async t => {
  let findOneCharacter = findOneFactory(character);
  let boromir = await findOneCharacter({name: 'boromir'});
  t.is(boromir, undefined);
});

test.serial('integration - find one document from _id', async t => {
  let find = findFactory(character, 'character');

  let [mithrandir] = await find({_id: gandalf._id});
  t.is(mithrandir.props.name, 'Gandalf The White');
  t.deepEqual(mithrandir.props, Object.assign({}, gandalf, {
    weapon: gandalfStaff
  }));
});

test.serial('integration - find by race', async t => {
  let find = findFactory(character, 'character');

  let res = await find({race: 'Hobbit'});
  t.deepEqual(res.map(el => el.props), [
    merry,
    pippin
  ]);
})

test.serial('integration - support sort and limit', async t => {
  let find = findFactory(character, 'character');

  let res = await find({limit: 2, sort: 'name', direction: -1});
  t.deepEqual(res.map(el => el.props), [
    pippin,
    merry
  ]);
});

test.serial('integration - support skip', async t => {
  let find = findFactory(character, 'character');

  let res = await find({limit: 1, sort: 'name', direction: -1});
  t.deepEqual(res.map(el => el.props), [
    pippin
  ]);
});

test.serial('integration - findOrCreate find if it exists', async t => {
  let findOrCreate = findOrCreateFactory(character);
  let find = findFactory(character, 'character');

  let res = await findOrCreate({name: 'Gandalf The White'}, {race: 'Hobbit'});
  t.deepEqual(res.props, Object.assign({}, gandalf, {
    weapon: gandalfStaff
  }));

  let docs = await find({name: 'Gandalf The White'});
  t.is(docs.length, 1);
});

test.serial('integration - findOrCreate creates if it does not exists', async t => {
  let findOrCreate = findOrCreateFactory(character);
  let find = findFactory(character, 'character');

  let res = await findOrCreate({name: 'Frodo'}, {race: 'Hobbit'});
  t.deepEqual(res.props, {
    _id: res.props._id,
    name: 'Frodo',
    race: 'Hobbit'
  });

  let docs = await find({name: 'Frodo'});
  t.is(docs.length, 1);
});

test.serial('integration - updateable set changes props', async t => {
  let find = findFactory(character, 'character');

  let [meriadoc] = await find({name: 'Merry'});
  meriadoc.set('name', 'Meriadioc Brandybuck');
  merry.name = 'Meriadioc Brandybuck';
  t.deepEqual(meriadoc.props, merry);
  t.is(meriadoc.props.name, 'Meriadioc Brandybuck');
});

test.serial('integration - updateable update', async t => {
  let find = findFactory(character, 'character');

  let [meriadoc] = await find({name: 'Merry'});
  meriadoc.set('name', 'Meriadioc Brandybuck');

  await meriadoc.update();

  merry.name = 'Meriadioc Brandybuck';
  t.deepEqual(meriadoc.props, merry);
  t.is(meriadoc.props.name, 'Meriadioc Brandybuck');

  let none = await find({name: 'Merry'});
  t.is(none.length, 0);

  let [meriadocBrandybuck] = await find({name: 'Meriadioc Brandybuck'});
  t.deepEqual(meriadocBrandybuck.props, merry);
  t.is(meriadocBrandybuck.props.name, 'Meriadioc Brandybuck');
});

test.serial('integration - remove', async t => {
  let find = findFactory(character, 'character');

  let [meriadoc] = await find({name: 'Meriadioc Brandybuck'});
  meriadoc.set('name', 'Meriadioc Brandybuck');

  await meriadoc.remove();

  let none = await find({name: 'Meriadioc Brandybuck'});
  t.is(none.length, 0);
})

test('defaultValues - mutate state props', t => {
  const state = {
    props: {
      valid: 'valid',
      emptyString: '',
      otherEmptyString: '',
      boolean: false,
      nullBool: undefined
    }
  };

  const hook = defaultValues(state, {
    valid: () => 'true',
    emptyString: 'not so empty',
    boolean: true,
    nullBool: false,
    someNumber: () => 42
  });
  hook.preUpdate()
  t.deepEqual(state, {
    props: {
      valid: 'valid',
      emptyString: 'not so empty',
      otherEmptyString: '',
      boolean: false,
      nullBool: false,
      someNumber: 42
    }
  })
});

test('validator - does not mutate valid props', async t => {
  const state = {
    props: {
      string: 'a string',
      boolean: true,
      int: 42
    }
  };
  const enforce = {
    string: sinon.spy(val => val),
    boolean: sinon.spy(val => val),
    int: [sinon.spy(val => val + 1), sinon.spy(val => val - 1)],
  }
  const {preUpdate} = validator(state, enforce);
  await preUpdate();
  t.deepEqual(enforce.string.args, [['a string']]);
  t.deepEqual(enforce.boolean.args, [[true]]);
  t.deepEqual(enforce.int[0].args, [[42]]);
  t.deepEqual(enforce.int[1].args, [[43]]);
});

test('enforce.required - does not do anything if defined', t => {
  const fun = enforce.required();
  t.is(fun('foo'), 'foo');
  t.is(fun('undefined'), 'undefined');
  t.is(fun(false), false);
  t.is(fun(true), true);
  t.is(fun(0), 0);
})

test('enforce.required - throws if undefined', t => {
  const fun = enforce.required();

  t.throws(() => fun(''));
  t.throws(() => fun(undefined));
  t.throws(() => fun(null));
  t.throws(() => fun());
});

test('enforce.number - does not mutate if valid', t => {
  const fun = enforce.number();
  t.is(fun(42), 42);
  t.is(fun('42'), '42');
  t.is(fun(1), 1);
  t.is(fun('-1'), '-1');
  t.is(fun(-1), -1);
  t.is(fun(0), 0);
})

test('enforce.number - mutate if not valid number', t => {
  const fun = enforce.number();

  t.is(fun('42a'), undefined);
  t.is(fun([1]), undefined);
  t.is(fun(undefined), undefined);
  t.is(fun(null), undefined);
  t.is(fun({x: 42}), undefined);
});

test('enforce.string - mutate anything', t => {
  const fun = enforce.string();
  t.is(fun('42'), '42');
  t.is(fun(1), '1');
  t.is(fun(true), 'true');
  t.is(fun({}), '[object Object]');
  t.is(fun('-1'), '-1');
})

test('enforce.boolean - does not mutate if valid', t => {
  const fun = enforce.boolean();
  t.is(fun(true), true);
  t.is(fun('true'), true);
  t.is(fun(1), true);
  t.is(fun('1'), true);
  t.is(fun(false), false);
  t.is(fun('false'), false);
  t.is(fun(0), false);
  t.is(fun('0'), false);
})

test('enforce.boolean - mutate if not valid boolean', t => {
  const fun = enforce.boolean();

  t.is(fun('42a'), undefined);
  t.is(fun('42a'), undefined);
  t.is(fun([1]), undefined);
  t.is(fun([true]), undefined);
  t.is(fun(null), undefined);
  t.is(fun(undefined), undefined);
  t.is(fun({x: 42}), undefined);
});

const Person = function(props) {
  let state = {
    name: 'person',
    fields: ['name', 'genre', 'age', 'height', 'place'],
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
    legacySupport(state),
    validator(state, {
      name: [enforce.string(), enforce.required()],
      genre: [enforce.string(
        'male',
        'female',
        'transexual',
        'androgyne',
        'agender',
        'fluid',
        'pangender',
        'other'
      )],
      age: [
        enforce.number(),
        enforce.range(0, 120),
        enforce.required()
      ],
      height: [enforce.number(), enforce.range(0, 250)],
      place: enforce.string()
    }), defaultValues(state, {
      place: 'world'
    })
  );
}
test('Person - refuses to create or update a Person without name', async t => {
  const someone = Person({age: 1});
  // await t.throws(someone.create());
  t.throws(someone.create())
  t.is(someone.props._id, undefined);

  const soelse = Person({age: 1, name: 'baby'});
  await soelse.create();
  soelse.set('name', undefined);
  t.throws(soelse.update());
});

test('Person - refuses to create or update a Person without age', async t => {
  const someone = Person({name: 'foo'});
  t.throws(someone.create());
  t.is(someone.props._id, undefined);
});

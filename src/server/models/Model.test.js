import Model from './Model';
import test from 'ava';
import process from 'process';

test('constructor should snake case db name', t => {
  t.is((new Model('myDoc')).dbName, 'my_docs');
})

test('field should type correctly to float', t => {
  let m = new Model('myModel');
  let floatField = m.field('foo').float();

  t.is(floatField.type, 'float');

  t.falsy(floatField.validator('foo'));
  t.falsy(floatField.validator('e'));
  t.falsy(floatField.validator());
  t.falsy(floatField.validator({}));
  t.falsy(floatField.validator(NaN));
  t.falsy(floatField.validator(function() {}));

  t.truthy(floatField.validator(15));
  t.truthy(floatField.validator(42.1));
  t.truthy(floatField.validator(-1337));
});

test('field should type correctly to int', t => {
  let m = new Model('myModel');
  let intField = m.field('foo').int();

  t.is(intField.type, 'int');

  t.falsy(intField.validator('foo'));
  t.falsy(intField.validator('e'));
  t.falsy(intField.validator());
  t.falsy(intField.validator({}));
  t.falsy(intField.validator(NaN));
  t.falsy(intField.validator(function() {}));
  t.falsy(intField.validator(42.1));

  t.truthy(intField.validator(15));
  t.truthy(intField.validator(-1337));
});

test('field should type correctly to string', t => {
  let m = new Model('myModel');
  let stringField = m.field('foo').string();

  t.is(stringField.type, 'string');

  t.truthy(stringField.validator('foo'));
  t.truthy(stringField.validator('e'));

  t.falsy(stringField.validator());
  t.falsy(stringField.validator({}));
  t.falsy(stringField.validator(NaN));
  t.falsy(stringField.validator(function() {}));
  t.falsy(stringField.validator(42.1));
});

test('field should type correctly to bool', t => {
  let m = new Model('myModel');
  let boolField = m.field('foo').boolean();

  t.is(boolField.type, 'boolean');

  t.falsy(boolField.validator('foo'));
  t.falsy(boolField.validator());
  t.falsy(boolField.validator({}));
  t.falsy(boolField.validator(NaN));
  t.falsy(boolField.validator(function() {}));

  t.truthy(boolField.validator(true));
});



test('should chain calls without Error', t => {
  (new Model('MyModel'))
    .field('itemName')
      .required()
      .string()
      .done()
    .field('itemCategory')
      .float()
      .notIdentity() // <-- means won't be accepted as a query
      .done()
    .noDuplicates()
    .acceptsEmptyQuery()
    .done()
});
let personModel = (name) => {
  return (new Model(name))
    .noDuplicates()
    .field('name')
      .required()
      .string()
      .defaultParam()
      .done()
    .field('age')
      .int()
      .done()
    .done();
}
test('model should accept a default type', t => {
  let Person = personModel('Person');

  t.is((new Person('Danny')).data.name, 'Danny');
});
test('model should generate correct payloads', t => {

  let Person = personModel('People');
  let bilbo = new Person({
    name: 'Bilbo',
    age: 131
  });
  t.deepEqual(bilbo.getPayload(), {
    name: 'Bilbo',
    age: 131
  });

  t.throws(function () {
      return (new Person({})).getPayload();
  });

  t.deepEqual((new Person({
    name: 'Aragorn',
    age: 121.2,
    height: 175
  })).getPayload(), {
    name: 'Aragorn'
  });

  t.throws(function () {
    (new Person({name: 42})).getPayload();
  });
});
test('model should create() correctly and then find it by id and name', async t => {
  let Person = personModel('Individuals');

  let bilbo = new Person({
    name: 'Bilbo',
    age: 131
  });

  await bilbo.create();

  let frodo = new Person({name: 'Frodo'});
  await frodo.create();

  t.not(bilbo._id, undefined);

  let res = await Person.findById(bilbo._id);
  t.is(res.data.age, 131);
  t.is(res.data.name, 'Bilbo');

  res = (await Person.find({name: 'Bilbo'}))[0];
  t.is(res.data._id, bilbo._id);
  t.is(bilbo.data.age, 131);
});

test('Model set function', async t => {
  let Person = personModel('Ppl');

  let jon = new Person({name: 'Jon Snow'});

  await jon.create();

  jon.set('name', 'Jon Targaryen');

  t.is((await Person.findById(jon._id)).data.name, 'Jon Snow');

  await jon.update();

  t.is((await Person.findById(jon._id)).data.name, 'Jon Targaryen');
});

test('finds multiple docs', async t => {
  let Person = personModel('Dudes');

  let john = new Person({
    name: 'john',
    age: 34
  });

  await john.create();

  let joe = new Person({
    name: 'joe',
    age: 34
  });

  await joe.create();

  let harvey = new Person({
    name: 'harvey',
    age: 42
  });

  await harvey.create();

  t.is((await Person.find({age: 34})).length, 2);
  t.is((await Person.find({age: 42})).length, 1);
});

test('correct dup check', async t => {
  let Soul = personModel('soul');
  let joe = new Soul('joe');
  await joe.create();
  let joey = new Soul('joe');
  t.throws(joey.create());
});

test('oneToMany', async t => {

  let Parent = (new Model('parent'))
    .field('name')
      .string()
      .required()
      .defaultParam()
      .done()
    .field('childId')
      .string()
      .done()
    .done();

  let Child = (new Model('child'))
    .field('name')
      .string()
      .required()
      .defaultParam()
      .done()
    .oneToMany(Parent, 'childId')
    .done();
  let bruce = new Child('Bruce');
  await bruce.create();

  let thomas = new Parent('Thomas');
  thomas.data.childId = bruce.data._id;
  await thomas.create();

  let martha = new Parent('Martha');
  martha.data.childId = bruce.data._id;
  await martha.create();

  let yourMother = new Parent('Lady of the night'); // :D :D :D
  await yourMother.create();

  let parents = await bruce.getParents();
  t.is(parents.length, 2);

  if(parents[0].name == 'Thomas') {
    t.is(parents[1].data.name, 'Martha')
    t.is(parents[1].data._id, martha._id);
    t.is(parents[0].data._id, thomas._id);
  } else {
    t.is(parents[1].data.name, 'Thomas')
    t.is(parents[0].data.name, 'Martha')
    t.is(parents[1].data._id, thomas.data._id)
    t.is(parents[0].data._id, martha.data._id);
  }

  // Let's check it support basic query
  parents = await bruce.getParents({limit: 1});
  t.is(parents.length, 1);
  parents = await bruce.getParents({name: /lady/});
  t.is(parents.length, 0);
  parents = await bruce.getParents({name: /mas/});
  t.is(parents.length, 1);
  t.is(parents[0].data.name, 'Thomas');
});

test('implements function work', t => {
  let called = false

  let say = (name, str) => {
    t.is(name, 'Bacon');
    t.is(str, 'meoooow');
    called = true;
  }
  let Cat = new Model('cat')
    .field('name')
      .required()
      .string()
      .defaultParam()
      .done()
    .implement('getMeowing', function (length) {
      return 'me' + 'o'.repeat(length) + 'w';
    }).implement('meow', function (length) {
      return say(this.data.name, this.getMeowing(length));
    }).done();

  (new Cat('Bacon')).meow(4);
  t.truthy(called);
});

test('hooks', async t => {
  let barks = 1;

  let hook = function (self) {
    // console.log(Object.getOwnPropertyNames(self));
    self.bark();
  }

  let Dog = new Model('dog')
    .field('name')
      .required()
      .string()
      .defaultParam()
      .done()
    .implement('bark', () => {
      barks += 1;
    }).hook('construct:after', (self) => {
      hook(self);
    }).hook('create:before', hook)
    .hook('create:after', hook)
    .done();

  let Beiley = new Dog('Beiley');
  // t.is(barks, 2);
  await Beiley.create();
  t.is(barks, 4);
});

test('default value', async t => {
  let Bird = new Model('bird')
    .field('tweet')
      .string()
      .defaultValue('tweet-tweet')
      .done()
    .done();

  let sparrow = new Bird();
  t.is(sparrow.data.tweet, 'tweet-tweet');

});

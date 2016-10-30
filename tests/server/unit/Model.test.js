import Model from '../../../src/server/models/Model';
import test from 'ava';

test('constructor should snake case db name', t => {
  t.is((new Model('myDoc')).dbName, 'my_doc');
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
      .noDuplicates()
      .done()
    .field('itemCategory')
      .float()
      .notIdentity() // <-- means won't be accepted as a query
      .done()
    .acceptsEmptyQuery()
    .done()
});
let personModel = (name) => {
  return (new Model(name))
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
})

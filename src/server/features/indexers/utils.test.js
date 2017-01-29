import {nextCallDelay, expandObject, expandArray} from './utils';
import test from 'ava';

test('nextCallDelay should by default return 0', (t) => {
  t.is(nextCallDelay([], 5, 1e5), 0);
});

test('nextCallDelay should return 0 when rate is not reached', (t) => {
  t.is(nextCallDelay([Date.now()], 5, 1e5), 0);
  t.is(nextCallDelay([Date.now() - 100], 5, 1e5), 0);
  t.is(nextCallDelay([
    -100, -1000, -1337, -1337 - 42
  ], 5, 1e5, 0), 0);
  t.is(nextCallDelay([
    -100,
    -1000,
    -1000000,
    -10000000,
    -100000000,
    -100000000
  ], 5, 1e5, 0), 0);
});

test('nextCallDelay should delay when rate is reached', t => {
  t.is(nextCallDelay([
    -100, -150, -179, -200, -256
  ], 5, 1e5, 0), 100);
  t.is(nextCallDelay([
    -42, -150, -179, -200, -1377
  ], 5, 1e5, 0), 42);
});

test('nextCallDelay should delay multiple times if needed', t => {
  t.is(nextCallDelay([
    -10,
    -11,
    -12,
    -150,
    -179,
    -200,
    -1377
  ], 5, 1e5, 0), 12);
  t.is(nextCallDelay([
    -10,
    -42,
    -42,
    -150,
    -179,
    -200,
    -1377
  ], 5, 1e5, 0), 42);
});

test('nextCallDelay should deduce from now', t => {
  const x = 1337;
  t.is(nextCallDelay([
    x - 42,
    x - 150,
    x - 179,
    x - 200,
    x - 1377
  ], 5, 1e5, x), 42);
});

test('nextCallDelay should reduce as time goes on', t => {
  let now = 0;
  const m = 5,
    f = 100;
  let stack = [
    28,
    29,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100
  ].map((t) => now - t);
  t.is(nextCallDelay(stack, m, f, now), 50);
  now += 10;
  t.is(nextCallDelay(stack, m, f, now), 50);
  now += 20;
  t.is(nextCallDelay(stack, m, f, now), 59);
});

test('expandObject should correctly expand object with strings', t => {
  t.deepEqual(expandObject({
    animal: 'cat',
    legs: 4,
    colors: ['blue', 'white', 'red']
  }, 'colors'), [
    {
      animal: 'cat',
      legs: 4,
      colors: 'blue'
    }, {
      animal: 'cat',
      legs: 4,
      colors: 'white'
    }, {
      animal: 'cat',
      legs: 4,
      colors: 'red'
    }
  ]);
});


const stones = {
  weight: 0.5,
  type: 'Quest Item',
  value: 200,
  locations: [
    {
      id: 1,
      hold: 'Eastmarch',
      locationName: 'Ansilvund – Ansilvund Burial Chambers'
    }, {
      id: 2,
      hold: 'Falkreath',
      locationName: 'Dark Brotherhood Sanctuary'
    }, {
      id: 3,
      hold: 'Whiterun',
      locationName: 'Dragonsreach Jarl\'s Quarters'
    }
  ]
};

const expStonesNested = [
  {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    locations: {
      id: 1,
      hold: 'Eastmarch',
      locationName: 'Ansilvund – Ansilvund Burial Chambers'
    }
  }, {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    locations: {
      id: 2,
      hold: 'Falkreath',
      locationName: 'Dark Brotherhood Sanctuary'
    }
  }, {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    locations: {
      id: 3,
      hold: 'Whiterun',
      locationName: 'Dragonsreach Jarl\'s Quarters'
    }
  }
];
const expStonesFlat = [
  {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    id: 1,
    hold: 'Eastmarch',
    locationName: 'Ansilvund – Ansilvund Burial Chambers'
  }, {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    id: 2,
    hold: 'Falkreath',
    locationName: 'Dark Brotherhood Sanctuary'
  }, {
    weight: 0.5,
    type: 'Quest Item',
    value: 200,
    id: 3,
    hold: 'Whiterun',
    locationName: 'Dragonsreach Jarl\'s Quarters'
  }
];

test('expandObject should work with objects', t => {
  t.deepEqual(expandObject(stones, 'locations'), expStonesNested);
});

test('expandObject should support keepObject', t => {
  t.deepEqual(expandObject(stones, 'locations', false), expStonesFlat);
});

test('expandArray should work nested', t => {
  let expected = expStonesNested.concat(expStonesNested);
  let res = expandArray([stones, stones], 'locations');
  t.deepEqual(res, expected)
});

test('expandArray should work flat', t => {
  let expected = expStonesFlat.concat(expStonesFlat);
  let res = expandArray([stones, stones], 'locations', false);
  t.deepEqual(res, expected)
});

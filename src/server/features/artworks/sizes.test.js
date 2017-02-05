import test from 'ava';
import {sizesArray, sizesMap, getClosestSize} from './sizes';

test('sizesArray should be as expected', t => {
  t.deepEqual(sizesArray, [{
    name: 'small',
    value: 34
  }, {
    name: 'medium',
    value: 64
  }, {
    name: 'large',
    value: 174
  }, {
    name: 'extralarge',
    value: 300
  }, {
    name: 'mega',
    value: 600
  }]);
});

test('getClosestSize should return the closest size', t => {
  t.is(getClosestSize(34), 'small');
  t.is(getClosestSize(32), 'small');
  t.is(getClosestSize(38), 'small');
  t.is(getClosestSize(172), 'large');
  t.is(getClosestSize(174), 'large');
  t.is(getClosestSize(370), 'extralarge');
  t.is(getClosestSize(2000), 'mega');
});

test('getClosestSize should accept an array of available sizes', t => {
  t.is(getClosestSize(34, ['mega', 'large']), 'large');
  t.is(getClosestSize(34, ['mega']), 'mega');
  t.is(getClosestSize(1337, ['small']), 'small');
});

test('getClosestSize should throw if available sizes is empty', t => {
  t.throws(() => getClosestSize(42, []));
});

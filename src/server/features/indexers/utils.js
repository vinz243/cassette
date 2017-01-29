import omit from 'lodash/omit';

export function nextCallDelay(calls, max, timeFrame, now = Date.now()) {
  let callsFromNow = calls.map((time) => now - time).sort((a, b) => a - b);
  let lastCalls = callsFromNow.filter((time) => time < timeFrame);
  if (lastCalls.length - max >= 0) {
    return lastCalls[lastCalls.length - max];
  }
  return 0;
};

// This will expand a single object from one of its property
// {
//   a: 1,
//   b: [2, 3, 4]
// }
// will result in
// [{a:1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]
//
// keepObject determines wether the nested properties are kept nested

export function expandObject(obj, property, keepObject = true) {
  return (obj[property] || []).map((val) => {
    return Object.assign({}, omit(obj, property), (keepObject ? {
      [property]: val
    } : val));
  });
};
// Calls expandobject for each element
export function expandArray(arr, property, keepObject = true) {

  return arr.map((el) => {
    return expandObject(el, property, keepObject)
  }).reduce((a, b) => {
    return a.concat(b);
  }, []);
};

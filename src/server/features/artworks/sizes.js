import assert from 'assert';
export const sizesMap = {
  small: 34,
  medium: 64,
  large: 174,
  extralarge: 300,
  mega: 600
};

export const sizesArray = Object.keys(sizesMap).map(key => ({
  name: key,
  value: sizesMap[key]
}));

export const getClosestSize = (target, sizes = Object.keys(sizesMap)) => {
  assert(sizes.length > 0);
  return sizesArray.filter(s => sizes.includes(s.name)).reduce((curr, val) => {
    let delta = Math.abs(target - sizesMap[val.name]);
    if (Math.abs(target - sizesMap[curr]) > delta)
      return val.name;
    return curr;
  }, sizes[0]);
};

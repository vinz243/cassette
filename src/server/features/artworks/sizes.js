const assert = require("assert");
const sizesMap = module.exports.sizesMap = {
  small: 34,
  medium: 64,
  large: 174,
  extralarge: 300,
  mega: 600
};

const sizesArray = module.exports.sizesArray = Object.keys(sizesMap).map(key => ({
  name: key,
  value: sizesMap[key]
}));

const getClosestSize = module.exports.getClosestSize = (target, sizes = Object.keys(sizesMap)) => {
  assert(sizes.length > 0);
  return sizesArray.filter(s => sizes.includes(s.name)).reduce((curr, val) => {
    let delta = Math.abs(target - sizesMap[val.name]);
    if (Math.abs(target - sizesMap[curr]) > delta)
      return val.name;
    return curr;
  }, sizes[0]);
};

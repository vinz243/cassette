import shortid from 'shortid';
let data = {};
export let push = (key, value) => {
  if(value) {
      data[key] = value;
      return push;
  }
  let id = shortid.generate();
  data[id] = key;
  return id;
}
export let pull = (key) => {
  return data[key];
}

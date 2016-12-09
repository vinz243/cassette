import Model from './Model';

let Library = new Model('library')
  .field('name')
    .string()
    .required()
    .defaultParam()
    .done()
  .field('path')
    .string()
    .done()
  .done();

export default Library;

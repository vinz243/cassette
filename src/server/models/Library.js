import Model from './Model';
import Scan from './Scan';

let Library = new Model('library')
  .field('name')
    .string()
    .required()
    .defaultParam()
    .done()
  .field('path')
    .string()
    .done()
  .oneToMany(Scan, 'libraryId')
  .done();

export default Library;

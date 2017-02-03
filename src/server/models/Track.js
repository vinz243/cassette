import Datastore from 'nedb-promise';
// import Artist from './Artist.js';
import mkdirp from 'mkdirp';
import Lazy from 'lazy.js';

import Model from './Model';
import File from './File';

let Track = (new Model('track'))
  .field('name')
    .defaultParam()
    .required()
    .string()
    .done()
  .field('duration')
    .float()
    .notIdentity()
    .done()
  .field('albumId')
    .oneToOne()
    .done()
  .field('artistId')
    .oneToOne()
    .done()
  .oneToMany(File, 'trackId')
  .noDuplicates()
  .done();

export default Track;

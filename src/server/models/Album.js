import Datastore from 'nedb-promise';
import conf from '../../../config.js';
import config from './config.js';
import Artist from './Artist.js';


import Lazy from 'lazy.js';
import Model from './Model';
// schema:
//   name: albumName
//   artistId: id of artistId
//   year: year
let Album = new Model('album')
  .field('name')
    .string()
    .required()
    .defaultParam()
    .done()
  .field('artistId')
    .oneToOne()
    // .required()
    .done()
  .field('year')
    .int()
    .done()
  .noDuplicates()
  .done()

export default Album;

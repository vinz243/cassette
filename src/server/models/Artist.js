import Datastore from 'nedb-promise';

import conf from '../../../config.js';
import config from './config.js';
import mkdirp from 'mkdirp';
import Model from './Model'
import Lazy from 'lazy.js';

// ARTIST SCHEMA:
//   _id: artistsid
//   name: artist name
//   coverArt: art id (not implemented)
//   genre: genre

let Artist = (new Model('artist'))
  .field('name')
    .defaultParam()
    .required()
    .string()
    .done()
  .field('genre')
    .string()
    .done()
  .noDuplicates()
  .done();

export default Artist;

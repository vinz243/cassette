import Lazy from 'lazy.js';


import Artist from './Artist';
import Album from './Album';
import Track from './Track';

import conf from '../../../config.js';

import Model from './Model';


// Schema:
//   _id: id of file
//   path: abs path to file
//   format: format
//   bitrate: audio bitrate in kbps
//   lossless: boolean
//   size: file size in bytes
//   duration: duration in ms
//   trackId: track id
//   albumId: album id
//   artistId: artist id

let File = new Model('file')
  .field('path')
    .defaultParam()
    .required()
    .string()
    .done()
  .field('bitrate')
    .int()
    .done()
  .field('format')
    .notIdentity()
    .string()
    .done()
  .field('lossless')
    .boolean()
    .notIdentity()
    .done()
  .field('size')
    .int()
    .notIdentity()
    .done()
  .field('duration')
    .int()
    .notIdentity()
    .done()
  .field('trackId')
    .oneToOne()
    .done()
  .field('artistId')
    .oneToOne()
    .done()
  .field('albumId')
    .oneToOne()
    .done()
  .done()

export default File;

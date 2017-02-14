import {find as findArtist,
        findById as findArtistById} from '../models/Artist';
import {find as findAlbum,
        findById as findAlbumById} from '../models/Album';
import {find as findTrack} from '../models/Track';
import {find as findFile} from '../models/File';

import {fetchable, oneToMany, updateable} from './Controller';
import merge from 'lodash/merge';


export default merge({},
  fetchable('album', findAlbum, findAlbumById),
  updateable('album', findAlbumById),
  oneToMany('album', 'track', findTrack),
  oneToMany('album', 'file', findFile)
);

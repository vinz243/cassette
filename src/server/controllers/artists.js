import {find as findArtist,
        findById as findArtistById} from '../models/Artist';
import {find as findAlbum} from '../models/Album';
import {find as findTrack} from '../models/Track';
import {find as findFile} from '../models/File';
import {fetchable, oneToMany, updateable} from './Controller';
import merge from 'lodash/merge';


export default merge({},
  fetchable('artist', findArtist, findArtistById),
  updateable('artist', findArtistById),
  oneToMany('artist', 'album', findAlbum),
  oneToMany('artist', 'track', findTrack),
  oneToMany('artist', 'file', findFile)
);

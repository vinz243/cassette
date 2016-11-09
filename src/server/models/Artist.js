import Album from './Album';
import Track from './Track';
import Model from './Model';

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
  .oneToMany(Album, 'artistId')
  .oneToMany(Track, 'artistId')
  .done();

export default Artist;

import Datastore from 'nedb-promise';
import conf from '../../../config.js';
import config from './config.js';
import Artist from './Artist.js';
import mkdirp from 'mkdirp';
import Lazy from 'lazy.js';
// import shorti

mkdirp.sync(conf.rootDir + '/data/')

// console.log('  Using dir ' + conf.rootDir);
let db = new Datastore(conf.rootDir + '/data/tracks.db');
db.loadDatabase();

class Track {
  constructor(name) {
    this.name = name.name || name;
    this._id = name._id;
    this.duration = name.duration;
    this.albumId = name.albumId;
    this.artistId = name.artistId;
  }
  async getFiles() {

  }
  async getArtist() {

  }
  async getAlbum() {

  }
  async create() {
    if (this._id) {
      throw new Error('Track already exsists in db');
    }
    let res = await db.insert({
      duration: this.duration,
      name: this.name,
      artistId: this.artistId,
      albumId: this.albumId
    });
    this._id = res._id;
    return this;
  }
  static async search(query) {

  }
  static async getById(id) {
    return (await Track.get({_id: id}))[0];
  }
  static async get(query) {
    let q = Lazy(query).pick(['name', '_id', 'artistId', 'albumId', 'duration']).value();

    if(Object.keys(q) == 0)
      throw new Error('No valid query');

    let docs = await db.find(q);

    return docs.map((doc) => {
      return new Track(doc);
    });
  }

}

export default Track;

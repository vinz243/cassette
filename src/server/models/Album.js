import Datastore from 'nedb-promise';
import conf from '../../../config.js';
import config from './config.js';
import Artist from './Artist.js';
import mkdirp from 'mkdirp';
import Lazy from 'lazy.js';
// import shorti

mkdirp.sync(conf.rootDir + '/data/')

// console.log('  Using dir ' + conf.rootDir);
let db = new Datastore(conf.rootDir + '/data/albums.db');
db.loadDatabase();

// schema:
//   name: albumName
//   artistId: id of artistId
//   year: year

class Album {
  constructor(data) {
    if(data.name) {
      this.name = data.name;
      if (data._id) {
        this._id = data._id;
      }
      this.artistId = data.artistId;
      this.year = data.year;
    } else {
      this.name = data;
    }
  }

  async getTracks() {

  }

  async getArtist() {
      return await Artist.getById(this.artistId);
  }
  async create() {
    if (this._id) {
      throw new Error('Item is already in database');
    }
    let res = await db.insert({
      name: this.name,
      artistId: this.artistId,
      year: this.year
    });

    this._id = res._id;
    return this;
  }
  static async getById(albumId) {
    return (await this.get({_id: albumId}))[0];
  }
  static async getOne(albumName) {
    return (await this.get({name: albumName}))[0];
  }
  static async get(query) {
    let q = Lazy(query).pick(['name', '_id', 'artistId', 'year']).value();

    if(Object.keys(q) == 0)
      throw new Error('No valid query');

    let docs = await db.find(q);

    return docs.map((doc) => {
      return new Album(doc);
    });
  }
}

export default Album;

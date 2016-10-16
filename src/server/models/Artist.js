import Datastore from 'nedb-promise';

import conf from '../../../config.js';
import config from './config.js';
import mkdirp from 'mkdirp';
import Lazy from 'lazy.js';
// mkdirp.sync(conf.rootDir + '/data/')

// console.log('  Using dir ' + conf.rootDir);
let db = new Datastore(conf.rootDir + '/data/artists.db');
db.loadDatabase();

// ARTIST SCHEMA:
//   _id: artistsid
//   name: artist name
//   coverArt: art id (not implemented)
//   genre: genre

class Artist {
  constructor(name) {
    if(name._id && name.name) {
      let item = name;
      this.name = item.name;
      this.genre = item.genre;
      this._id = item._id;
      // this.dbId = item._id;
    } else {
      this.name = name;
    }
  }

  async getAlbums() {
    if (!this._id) {
      throw new Error('artist is not in database');
    }

    return await Album.get({artistId: this._id});
  }
  async getTracks() {
    if (!this._id) {
      throw new Error('artist is not in database');
    }

    return await Track.get({artistId: this._id});
  }
  async create() {
    if (this._id) {
      throw new Error('Cannot create an artist which is already in database');
    }
    if((await db.find({name: this.name})).length > 0 &&
      !(await config.get('model_ignore_dups', false))) {
      throw new Error('Duplicate artist. set model_ignore_dups to true to ignore')
    }
    let res = await db.insert({
      name: this.name,
      genre: this.genre
    })
    this._id = res._id;
    return new Artist(res);
  }
  static async search(query) {
    throw new Error('Not implemented');
  }
  static async getById(id) {
    return Artist.get({_id: id});
  }
  static async get(query) {
    let q = Lazy(query).pick([
      'name', '_id', 'genre'
    ]).value();
    if(Object.keys(q) === 0) {
      throw new Error('No query specified, or wrong one');
    }
    // console.log('q', q);
    let res = [];
    let docs = await db.find(q);
    // console.log('doc', docs);
    for(let doc in docs) {
      res.push(new Artist(docs[doc]));
    }

    return res;
  }
}

export default Artist;

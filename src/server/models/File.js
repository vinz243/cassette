import Datastore from 'nedb-promise';
import Lazy from 'lazy.js';

import mkdirp from 'mkdirp';

import Artist from './Artist';
import Album from './Album';
import Track from './Track';

import conf from '../../../config.js';

mkdirp.sync(conf.rootDir + '/data/')

// console.log('  Using dir ' + conf.rootDir);
let db = new Datastore(conf.rootDir + '/data/files.db');
db.loadDatabase();


// Schema:
//   _id: id of file
//   path: abs path to file
//   format: format
//   bitrate: audio bitrate in kbps
//   lossless: boolean
//   size: file size in bytes
//   duration: duration in ms
//   score: computer score based on bitrate / format / size
//   trackId: track id
//   albumId: album id
//   artistId: artist id

class File {
  constructor(data) {
    if(data._id) {
      this._id = data._id;
    }
    this.path = data.path;
    this.format = data.format;
    this.bitrate = data.bitrate;
    this.lossless = data.lossless || (data.format == 'FLAC');
    this.size = data.size;
    this.duration = data.duration;
    this.score = data.score;
    this.trackId = data.trackId;
    this.albumId = data.albumId;
    this.artistId = data.artistId;
  }
  async getTrack() {
    if(!this.trackId)
      return undefined;
    return await Track.getById(this.trackId);
  }
  async getArtist() {
    if(!this.artistId && !this.trackId)
      return undefined;
    return await Artist.getById(this.artistId);
  }
  async getAlbum() {
    if(!this.albumId) {
      return undefined;
    }
    return Album.getById(this.artistId);
  }
  static async search(query) {

  }
  static async getById(id) {
    return (await File.get({_id: id}))[0];
  }
  static async get(query) {
    let q = Lazy(query).pick([
      '_id',
      'path',
      'format',
      'bitrate',
      'lossless',
      'size',
      'duration',
      'score',
      'trackId',
      'albumId',
      'artistId']).value();
    if(Object.keys(q) == 0)
      throw new Error('Empty or invalid query');
    return (await db.find(q)).map(doc => new File(doc));
  }
  static async getOne(path) {
    return (await File.get({path: path}))[0];
  }
  async create() {
    if(this._id) throw new Error('file already saved in db');

    let res = await db.insert({
      path: this.path,
      format: this.format,
      bitrate: this.bitrate,
      lossless: this.lossless,
      size: this.size,
      duration: this.duration,
      score: this.score,
      trackId: this.trackId,
      albumId: this.albumId,
      artistId: this.artistId
    });
    this._id = res._id;
    return this;
  }
  static fromFile(file) {
    // let data = {};

  }
}

export default File;

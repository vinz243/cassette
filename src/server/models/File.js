import Datastore from 'nedb-promise';



class File {
  constructor() {
  }
  async getTrack() {

  }
  async getArtist() {

  }
  async getAlbum() {

  }
  static async search(query) {

  }
  static async getById(id) {
    return File.get({_id: id});
  }
  static async get(query) {

  }
  static async getOne(artistName) {

  }
}

export default File;

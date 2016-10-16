import Datastore from 'nedb-promise';



class Artist {
  constructor() {
  }
  async getAlbums() {

  }
  async getTracks() {

  }
  static async search(query) {

  }
  static async getById(id) {
    return Artist.get({_id: id});
  }
  static async get(query) {

  }
  static async getOne(artistName) {

  }
}

export default Artist;

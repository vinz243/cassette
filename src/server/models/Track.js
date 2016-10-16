import Datastore from 'nedb-promise';



class Track {
  constructor() {
  }
  async getFiles() {

  }
  async getArtist() {

  }
  async getAlbum() {

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

export default Track;

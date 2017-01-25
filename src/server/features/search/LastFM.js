import request from 'request';

export default class LastFM {
  constructor (apiKey = '85d5b036c6aa02af4d7216af592e1eea') {
    this._apiKey = apiKey;
  }
  search(type, query, limit = 10, page = 0) {

    let url = `https://ws.audioscrobbler.com/2.0/?method=${type}.search&${type}=${encodeURIComponent(query)}&api_key=${this._apiKey}&format=json&limit=${limit}`;

    return new Promise((resolve, reject) => {
      request.get(url, (error, response, body) => {
        if (error) return reject(error);
        resolve(JSON.parse(body));
      });
    });
  }
  searchAlbum(query, limit = 10, page = 0) {
    return this.search('album', query, limit, page);
  }
  searchArtist(query, limit = 10, page = 0) {
    return this.search('artist', query, limit, page);
  }
  searchTrack(query, limit = 10, page = 0) {
    return this.search('track', query, limit, page);
  }
  static parseResult(body) {
    return new Promise((resolve, reject) => {
      let result = body.results;
      if (result.trackmatches) {
        return resolve(result.trackmatches.track.map((t) => {
          return {
            type: 'track',
            album: t.name,
            artist: t.artist
          };
        }));
      }
      // return resolve({
      //   type: mp
      //   artist_name,
      //   album_name,
      //   track_name,
      //   album_art
      // })
    });
  }
}

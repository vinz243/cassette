import request from 'request';
import {nextCallDelay, expandArray} from './utils';
import querystring from 'querystring';
import Release from './Release';

export default class GazelleAPI {
  defaultConfig = {
    hostname: 'passtheheadphones.me',
    protocol: 'https',
    port: 443,
    endpoint: 'ajax.php',
    username: '',
    password: '',
    rateLimitMaxCalls: 5,
    rateLimitTimeFrame: 10000,
  }
  constructor(config) {
    this._config = Object.assign({}, this.defaultConfig, config);
    this._calls = [];
    this._request = request.defaults({
      jar: request.jar()
    });
    this._loggedIn = false;
  }

  call(method, args) {
    if(!this._loggedIn) throw new Error('Not logged in');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._calls.push(Date.now());

        let query = Object.assign({
          action: method
        }, args);
        let qs = querystring.stringify(query);
        let {protocol, hostname, port, endpoint} = this._config;
        let url = `${protocol}://${hostname}:${port}/${endpoint}?${qs}`

        console.log('Calling ' + url);

        this._request.get(url, (err, res, data) => {
          if (err) return reject(err);
          const json = Object.assign({}, JSON.parse(data));
          resolve(json);
        });
      }, nextCallDelay(this._calls,
        this._config.rateLimitMaxCalls,
        this._config.rateLimitTimeFrame));
    });
  }
  searchTorrents(q = '') {
    return this.call('browse', {searchstr: q}).then(GazelleAPI.parseTorrents);
  }
  static parseTorrents(res) {
    return Promise.resolve(expandArray(res.response.results, 'torrents', false)
                  .map(GazelleAPI.toRelease));
  }
  static toRelease({groupName, encoding, isFreeleech, format, hasLog,
    torrentId, artist, seeders, groupYear}) {
    return new Release({
      album: groupName,
      lossless: encoding === 'Lossless',
      freeleech: isFreeleech,
      year: groupYear,
      format,
      encoding,
      hasLog,
      torrentId,
      artist,
      seeders
    });
  }
  login() {
    return new Promise((resolve, reject) => {
      if (this._loggedIn) {
        resolve();
      } else {
        let {protocol, hostname, port, endpoint, username, password} = this._config;
        let url = `${protocol}://${hostname}:${port}/login.php`
        this._request.post({
          uri: url,
          form: {
            username, password
          }
        }, (err, res, data) => {
          if (err) return reject(err);
          if (res.statusCode >= 400)
            return reject(new Error(res.statusCode));
          this._loggedIn = true;
          resolve();
        });
      }
    });
  }
}

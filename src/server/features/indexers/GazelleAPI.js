import request from 'request';
import {nextCallDelay, expandArray} from './utils';
import querystring from 'querystring';
import Release from './Release';
import {push} from '../store/database';
import shortid from 'shortid';
import {mainStory} from 'storyboard';
import chalk from 'chalk';

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

  call(method, args, endpoint = this._config.endpoint, ropts = {}) {
    if(!this._loggedIn) throw new Error('Not logged in');

    return new Promise((resolve, reject) => {
      let delay = nextCallDelay(this._calls,
        this._config.rateLimitMaxCalls,
        this._config.rateLimitTimeFrame);
      if (delay > 0)
        mainStory.info('indexers', `delaying request of ${delay}ms to avoid reaching rate`);

      setTimeout(() => {
        this._calls.push(Date.now());

        let query = Object.assign({}, {
          action: method
        }, args);
        let qs = querystring.stringify(query);
        let {protocol, hostname, port} = this._config;
        let url = `${protocol}://${hostname}:${port}/${endpoint}?${qs}`

        let time = Date.now();
        this._request.get(Object.assign({}, {url}, ropts), (err, res, data) => {
          if (err) return reject(err);
          mainStory.info('indexers', `request ${chalk.dim(url)} ${Date.now() - time}ms`);
          try {
            const json = Object.assign({}, JSON.parse(data));
            resolve(json);
          } catch (err) {
            resolve(data);
          }
        });
      }, delay);
    });
  }
  searchTorrents(q = '') {
    return this.call('browse', {searchstr: q}).then(GazelleAPI.parseTorrents);
  }
  getRawTorrent(id) {
    return this.call('download', {id}, 'torrents.php', {encoding: null});
    // if(!this._loggedIn) throw new Error('Not logged in');
    // this._request.get(url, (err, res, data) => {
    //   let qs = querystring.stringify();
    //   let url = `${protocol}://${hostname}:${port}/torrents.php?${qs}`;
    //
    // });
  }
  static parseTorrents(res) {
    if (!res || !res.response) {
      mainStory.warn('indexers', 'search failed', {attach: res})
      return [];
    }
    mainStory.info('indexers', `yielded ${res.response.results.length} results`);
    return Promise.resolve(expandArray(res.response.results, 'torrents', false)
                  .map(GazelleAPI.toRelease));
  }
  static toRelease({groupName, encoding, isFreeleech, format, hasLog,
    torrentId, artist, seeders, groupYear}) {
    let id = shortid.generate();
    let release = new Release({
      _id: id,
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
    push(id, release);
    return release;
  }
  login() {
    return new Promise((resolve, reject) => {
      if (this._loggedIn) {
        resolve();
      } else {
        let {protocol, hostname, port, endpoint, username, password} = this._config;
        mainStory.info('indexers', `Trying to logging you in as ${username}...`);
        let url = `${protocol}://${hostname}:${port}/login.php`
        this._request.post({
          uri: url,
          form: {
            username, password,
            keeplogged: 1
          }
        }, (err, res, data) => {
          if (err) return reject(err);
          if (res.statusCode >= 400)
            return reject(new Error(res.statusCode));
          this._loggedIn = true;
          mainStory.info('indexers', `Logged in as ${username}`);
          resolve();
        });
      }
    });
  }
}

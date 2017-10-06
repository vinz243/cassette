const mkdirp        = require('mkdirp');
const {scgi}        = require('./utils');
const {mainStory}   = require('storyboard');
const path          = require('path');
const config         = require('config');
const parseTorrent  = require('parse-torrent');
const assert        = require('assert');
const defaultOpts = {
  scgiPort: config.get('scgiPort'),
  scgiHost: config.get('scgiHost'),
  targetPath: path.join(config.get('configPath'), '/downloads')
};

module.exports = class RTorrentItem {
  constructor({infoHash, name}, opts) {
    this.infoHash = infoHash;
    this.name     = name;
    this.opts     = Object.assign({}, defaultOpts , opts);
  }

  getProgress () {
    const call = (name, params) => {
      return scgi.methodCall(name, params,
        this.opts.scgiHost, this.opts.scgiPort);
    }

    return Promise.all([
      call('d.get_complete', [this.infoHash]),
      call('d.get_bytes_done', [this.infoHash]),
      call('d.get_size_bytes', [this.infoHash])
    ]).then(([complete, done, size]) => {
      if ((complete - 0) === 1) {
        return Promise.resolve(1);
      }
      return Promise.resolve((+done) / (+size));
    });
  }

  static findTorrent(buffer, parse = parseTorrent, opts = {}) {
    const {infoHash, name} = parse(buffer);

    assert(infoHash !== undefined);
    return new RTorrentItem({infoHash, name}, opts);
  }

  static async addTorrent(content, options = {}) {
    const opts = Object.assign({}, defaultOpts, options);

    let parameters = [''];

    parameters.push(content);
    parameters.push(`d.directory.set="${opts.targetPath}"`);

    try {
      await scgi.methodCall('load.raw_start', parameters,
        opts.scgiHost, opts.scgiPort);
    } catch (err) {
      mainStory.error('scgi', 'Error while calling scgi', {attach: err});
      return Promise.reject(err);
    }

    return RTorrentItem.findTorrent(content, parseTorrent, opts);
  }
};

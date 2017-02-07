import mkdirp from 'mkdirp';
import scgi from './scgi';
import {mainStory} from 'storyboard';
import path from 'path';
import config from '../../config';
// var detectCharacterEncoding = require('detect-character-encoding');

export default class RTorrent {
  defaultOpts = {
    scgiPort: config.get('scgiPort'),
    scgiHost: config.get('scgiHost'),
    targetPath: path.join(config.get('configRoot'), '/downloads')
  }
  constructor(opts) {
    this.opts = Object.assign({}, this.defaultOpts, opts);

    mkdirp.sync(this.opts.targetPath);
  }
  addTorrent(content) {
    // let enc = detectCharacterEncoding(content);
    // console.log('Detected charcter encoding:', enc);
    let parameters = [''];

    parameters.push(content);
    parameters.push(`d.directory.set="${this.opts.targetPath}"`);
    // parameters.push(`d.custom.set=x-filename,RATM-Album`);
    try {
      return scgi.methodCall('load.raw_start', parameters,
        this.opts.scgiHost, this.opts.scgiPort);
    } catch (err) {
      mainStory.err('scgi', 'Error while calling scgi', {attach: err});
      return Promise.reject(err);
    }
  }
};

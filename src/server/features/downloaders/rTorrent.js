import mkdirp from 'mkdirp';
import scgi from './scgi';


var detectCharacterEncoding = require('detect-character-encoding');

export default class RTorrent {
  defaultOpts = {
    scgiPort: 52461,
    scgiHost: '0.0.0.0',
    targetPath: '/home/vincent/.cassette/downloads'
  }
  constructor(opts) {
    this.opts = Object.assign({}, this.defaultOpts, opts);

    mkdirp.sync(this.opts.targetPath);
  }
  addTorrent(content) {
    let enc = detectCharacterEncoding(content);
    console.log('Detected charcter encoding:', enc);
    let parameters = [''];

    parameters.push(content);
    parameters.push(`d.directory.set="${this.opts.targetPath}"`);
    // parameters.push(`d.custom.set=x-filename,RATM-Album`);

    return scgi.methodCall('load.raw_start', parameters,
      this.opts.scgiHost, this.opts.scgiPort);
  }
};

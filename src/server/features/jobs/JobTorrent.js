const shortid = require("shortid");
const parseTorrent = require("parse-torrent");
const assert = require("assert");
const scgi = require("../downloaders/scgi");
const config = require("../../config");

let jobs = [];
const defaultProps = {
  scgi: scgi.methodCall,
  scgiPort: config.get('scgiPort'),
  scgiHost: config.get('scgiHost')
}
module.exports = class JobTorrent {
  constructor (props) {
    this.props = Object.assign({}, this.defaultProps, props);
    assert(/^(\d|[a-f]){40}$/i.test(this.props.infoHash));

    if (!this.props._id) {
      this.props._id = shortid.generate();
    }
  }
  getData() {
    return this.getProgress().then((progress) => {
      return Promise.resolve(Object.assign({}, {
        _id: this.props._id,
        type: 'download',
        progress
      }, this.props.name ? {name: this.props.name} : {}))
    });
  }
  getProgress () {
    let call = (name, params) => {
      return this.props.scgi(name, params, this.props.scgiHost, this.props.scgiPort);
    }
    return Promise.all([
      call('d.get_complete', [this.props.infoHash]),
      call('d.get_bytes_done', [this.props.infoHash]),
      call('d.get_size_bytes', [this.props.infoHash])
    ]).then(([complete, done, size]) => {
      if ((complete - 0) === 1) {
        jobs = jobs.filter(el => el.props._id !== this.props._id);
        return Promise.resolve(1);
      }
      return Promise.resolve((done - 0) / (size - 0));
    });
  }
  static push(job, _jobs = jobs) {
    _jobs.push(job);
  }
  static find({type, _id}, _jobs = jobs) {
    return _jobs.filter((job) => {
        return (!_id || job.props._id === _id)
          && (!type || job.props.type === type);
    });
  }
  static findById(id, _jobs = job) {
    return JobTorrent.find({_id: id}, _jobs)[0];
  }
  static fromTorrent(buffer, parse = parseTorrent) {
    let parsed = parse(buffer)
    let infoHash = parsed.infoHash;
    let name = parsed.name;
    assert(infoHash !== undefined);
    return new JobTorrent({infoHash, name});
  }
}

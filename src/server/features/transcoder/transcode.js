const ffmpeg = require('fluent-ffmpeg');
const merge  = require('lodash/merge');
const assert = require('assert');

const {mainStory} = require('storyboard');

const defaultOpts = {
  audioChannels: 2,
  audioFrequency: 44100,
  audioQuality: 0,
  chunkLength: 10
}

// 0.025057 <------
const Transcode = module.exports = class Transcode {
  constructor (opts) {
    this.opts = merge({}, defaultOpts, opts);
  }
  probe () {
    return new Promise((resolve, reject) => {
      console.log(this.opts.source);
      ffmpeg.ffprobe(this.opts.source, (err, metadata) => {
        if (err) {
          return Promise.reject(err);
        }
        this.duration = metadata.format.duration;
        this.offset   = metadata.format.start_time || 0;

        const stream  = metadata.streams[0];
        assert.equal(stream.codec_type, 'audio');

        this.sampleRate = stream.sample_rate;
        return resolve(metadata);
      });
    })
  }
  transcodeChunk (index, output) {
    const {opts} = this;
    const duration = opts.chunkLength;
    const time = index * opts.chunkLength;

    return ffmpeg(opts.source)
    .duration(duration)
    .seekInput(time)
    .audioCodec('libmp3lame')
    .audioChannels(opts.audioFrequency)
    .audioFrequency(opts.audioFrequency)
    .audioQuality(opts.audioQuality)
    .noVideo()
    .format('mp3')
    .on('stderr', function(stderrLine) {
    }).output(output).run();
  }
  get props () {
    const chunks = Math.ceil(this.duration / this.opts.chunkLength);
    const {sampleRate, duration, offset} = this;
    return {
      chunks,
      opts: this.opts,
      sampleRate, duration, offset
    }
  }
}

const trans = new Transcode();

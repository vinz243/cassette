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
  codecFor (format = 'mp3') {
    return ({
        mp3: 'libmp3lame',
        flac: 'flac'
    })[format] || 'libmp3lame';
  }
  validFormat (format) {
    if (['mp3', 'flac'].includes(format)) {
      return format;
    }
    return 'mp3';
  }
  transcodeChunk (index, output) {
    return new Promise((resolve, reject) => {

    const {opts} = this;
    const duration = opts.chunkLength;
    const time = index * opts.chunkLength;

    ffmpeg(opts.source)
      .duration(duration)
      .seekInput(time)
      .audioCodec(this.codecFor(opts.format))
      .audioChannels(opts.audioFrequency)
      .audioFrequency(opts.audioFrequency)
      .audioQuality(opts.audioQuality)
      // .outputOptions('-map_metadata -1')
      .noVideo()
      .format(this.validFormat(opts.format))
      .on('start', function(commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .on('codecData', function(data) {
        console.log('Input is ' + data.audio + ' audio ' +
          'with ' + data.video + ' video');
      })
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', function(stdout, stderr) {
        console.log('Transcoding succeeded !');
        resolve();
      })
      .on('stderr', function(stderrLine) {
        console.log(stderrLine);
      })
      .on('error', function (err) {
        console.log(err);
        reject(err);
      })
      .output(output).run();
    });
  }
  getMimeType () {
    return ({
      mp3: 'audio/mpeg',
      flac: 'audio/flac'
    })[this.opts.format] || 'audio/mpeg';
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

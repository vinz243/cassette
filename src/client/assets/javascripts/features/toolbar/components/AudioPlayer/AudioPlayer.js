import React, { Component, PropTypes } from 'react';

import './AudioPlayer.scss';
import axios from 'app/axios';

export default class AudioPlayer extends Component {
  constructor() {
    super();
    this.buffered = 0;
  }
  updateProgress (val = this.range.value, buffer = this.buffered) {

    const percent =
      ((val - this.range.min) /
        (this.range.max - this.range.min)) * 100;

    const buffered =
      ((buffer - this.range.min) /
        (this.range.max - this.range.min)) * 100;

    this.range.style.background = `linear-gradient(to right, #ffffff 0%,#ffffff ${
      percent
    }%,#586785 ${
      percent
    }%,#586785 ${
      buffered
    }%,#363439 ${
      buffered
    }%,#363439 100%)`;

  }
  componentDidMount()  {
    this.audio.addEventListener('loadedmetadata', (evt) => {
      // this.range.max = this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', (evt) => {
      window.requestAnimationFrame(() => {
        this.range.value = this.audio.currentTime;
        this.updateProgress();
      });
    });
    this.audio.addEventListener('ended', (e) => {
      if (this.props.onEnded) {
        this.props.onEnded(e);
      }
    });
    this.range.onchange = (evt) => {
      window.requestAnimationFrame(() => {
        this.updateProgress(this.range.value);
      });
      if (this.range.value  !== this.audio.currentTime) {
        this.audio.currentTime = this.range.value;
      }
    };
  }
  componentWillMount() {

  }
  createMediaSource (src) {
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

      const onAudioLoaded = (data, index) => {
        this.buffered = this.buffered + 10.0;
        const gaplessMetadata = {
          audioDuration: 10.0,
          frontPaddingDuration: 0.025057
        };

        const appendTime = index > 0 ? sourceBuffer.buffered.end(0) : 0;
        sourceBuffer.appendWindowEnd = appendTime + gaplessMetadata.audioDuration - 0.02;
        sourceBuffer.appendWindowStart = appendTime;
        sourceBuffer.timestampOffset = appendTime - gaplessMetadata.frontPaddingDuration;

        if (index === 0) {
          sourceBuffer.addEventListener('updateend', () => {
            if (++index < this.props.source.chunks) {
              this.getChunk(index).then(function(data) { onAudioLoaded(data, index); } );
            } else {
              // We've loaded all available segments, so tell MediaSource there are no
              // more buffers which will be appended.
              mediaSource.endOfStream();
              URL.revokeObjectURL(this.audio.src);
            }
          });
        }

        sourceBuffer.appendBuffer(data);
      }

      this.getChunk(0).then(function(data) { onAudioLoaded(data, 0); } );
    });
    return mediaSource;
  }
  getChunk (index) {
    return axios.get({
      url: `/api/v2/transcodes/${this.props.source._id}/chunks/${index}`,
      headers: {
        // 'Accept-Encoding': 'audio/mpeg'
      },
      responseType: 'arraybuffer'
    }).then(({data}) => Promise.resolve(data));
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.source && this.audio && this.props.source !== nextProps.source) {
      this.buffered = 0;
      this.audio.src = URL.createObjectURL(this.createMediaSource());
      this.audio.currentTime = 0;
      this.range.value = 0;
      this.range.min = "0";
      this.range.max = `${nextProps.source.duration}`;

      this.audio.play();
      this.props.onPlay && this.props.onPlay();
    }
    if (this.audio && nextProps.playing === this.audio.paused) {
      if (nextProps.playing)
        this.audio.play();
      else this.audio.pause();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    const { source } = this.props;

    return (
      <div className="audioPlayer">
        <audio
         className="react-audio-player"
         autoPlay={false}
         preload={true}
         controls={false}
         ref={(ref) => { this.audio = ref; }}
         onPlay={this.onPlay || new Function()}
       > </audio>
        <input type="range" ref={(ref) => this.range = ref } />
      </div>
    );
  }
}

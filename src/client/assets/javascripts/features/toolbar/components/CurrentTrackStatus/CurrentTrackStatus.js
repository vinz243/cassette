import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {Button, Row, Col, Slider} from 'antd';
import 'antd/dist/antd.css';
import './CurrentTrackStatus.scss';
import GoPlaybackRewind from 'react-icons/lib/go/playback-rewind';
import GoPlaybackPause from 'react-icons/lib/go/playback-pause';
import GoPlaybackFastForward from 'react-icons/lib/go/playback-fast-forward';

import GoMute from 'react-icons/lib/go/mute';
import GoUnmute from 'react-icons/lib/go/unmute';


export default class CurrentTrackStatus extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };
  msToTime(ms) {
    let millis = Math.abs(Math.round(ms));
    let secs = millis / 1000;

    let minutes = Math.round((secs - secs % 60) / 60);
    let seconds = Math.round((secs % 60));
    let sign = ((ms < 0) ? '-' : '');

    let minStr = minutes > 9 ? minutes + '' : '0' + minutes;
    let secStr = seconds > 9 ? seconds + '' : '0' + seconds;

    return sign + minStr + ':' + secStr;
  }
  handleTimeStatusChange() {
    showTrackDuration = !showTrackDuration;
  }
  handleTimeChange(val) {
    const { toolbar, actions } = this.props;
    actions.seek((val/100) * (toolbar.currentTrack || {}).duration);
  }
  tipFormatter(val) {
    const { toolbar, actions } = this.props;
    return this.msToTime((val/100) * (toolbar.currentTrack || {}).duration);
  }
  componentDidMount() {
    setInterval(() => {
        this.props.actions.updateTime();
    }, 1000);
  }
  render() {
    const { toolbar, actions } = this.props;
    const boundHandleTimeStatusChange =
      this.handleTimeStatusChange.bind(this);

    const boundTipFormattter = this.tipFormatter.bind(this);

    const boundHandleTimeChange = this.handleTimeChange.bind(this);
    return (
    	<div className="currentTrackStatus">
	    	<div>
	    		<Row gutter={24} className="currentTrackStatusRow">
            <div className="currentTrackTitle">{(toolbar.currentTrack || {}).name}</div>
            <div className="currentTrackSubtitle">{((toolbar.currentTrack || {}).artist || {}).name} &#8212; {((toolbar.currentTrack || {}).album || {}).name}</div>
            <div className="currentTrackTime">
              <Row gutter={4}>
                <Col span={2}>
                  <span className="currentTime">
                    {this.msToTime(toolbar.currentTime)}
                  </span>
                </Col>
                <Col span={20}>
                  <Slider className="trackTimeSlider"
                    value={(toolbar.currentTime / (toolbar.currentTrack || {duration: 1}).duration) * 100}
                    tipFormatter={boundTipFormattter}
                    onChange={boundHandleTimeChange} />
                </Col>
                <Col span={2}>
                  <span className="timeLeft" onClick={boundHandleTimeStatusChange}>
                    {false ?
                      this.msToTime((toolbar.currentTrack ||
                        {duration: 0}).duration) :
                      this.msToTime(toolbar.currentTime
                        - (toolbar.currentTrack || {duration: 0}).duration)}
                  </span>
                </Col>
              </Row>
            </div>
	    		</Row>
	    	</div>
	    </div>
    );
  }
}

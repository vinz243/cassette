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

  render() {
    const { toolbar, actions } = this.props;

    return (
    	<div className="currentTrackStatus">
	    	<div>
	    		<Row gutter={24} className="currentTrackStatusRow">
            <div className="currentTrackTitle">Bullet in the head</div>
            <div className="currentTrackSubtitle">Rage Against The Machine - Bombtrack</div>
            <div className="currentTrackTime">
              <Row gutter={4}>
                <Col span={2}>
                  <span className="currentTime">
                    1:14
                  </span>
                </Col>
                <Col span={20}>
                  <Slider className="trackTimeSlider" />
                </Col>
                <Col span={2}>
                  <span className="timeLeft">
                    -3:58
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

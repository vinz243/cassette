import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {Button, Row, Col, Slider} from 'antd';
import 'antd/dist/antd.css';
import './PlayerControls.scss';
import GoPlaybackRewind from 'react-icons/lib/go/playback-rewind';
import GoPlaybackPause from 'react-icons/lib/go/playback-pause';
import GoPlaybackPlay from 'react-icons/lib/go/playback-play';
import GoPlaybackFastForward from 'react-icons/lib/go/playback-fast-forward';

import GoMute from 'react-icons/lib/go/mute';
import GoUnmute from 'react-icons/lib/go/unmute';


export default class PlayerControls extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };
  rewind(e) {
    const { toolbar, actions } = this.props;
    actions.playPrevious();

  }
  pauseUnpause(e) {
    const { toolbar, actions } = this.props;
    actions.togglePause();
  }
  mute(e) {
    const {toolbar, actions} = this.props;
    actions.setVolume(0.0);
  }
  unmute(e) {
    const {toolbar, actions} = this.props;
    actions.setVolume(1.0);
  }
  changeVolume(val) {
    const {toolbar, actions} = this.props;
    actions.setVolume(val / 100);
  }
  render() {
    const { toolbar, actions } = this.props;

    let PlayPauseButton;
    if (toolbar.playing) {
      PlayPauseButton = <GoPlaybackPause />;
    } else {
      PlayPauseButton = <GoPlaybackPlay />;
    }

    const boundPauseUnpause = this.pauseUnpause.bind(this);
    const boundMute = this.mute.bind(this);
    const boundChangeVolume = this.changeVolume.bind(this);
    const boundUnmute = this.unmute.bind(this);
    const boundRewind = this.rewind.bind(this);

    return (
    	<div className="controlsContainer">
	    	<div>
	    		<Row gutter={24} className="playerControls">
            <Col span={2}></Col>
	    			<Col span={10}>
	    				<Row gutter={16}>
			    			<Col span={8}>
			    				<div onClick={boundRewind} className={'rewindControl' +
                    ((toolbar.previousTrack || toolbar.currentTrack) ?
                        '' : ' disabled')}>
			    					<GoPlaybackRewind />
			    				</div>
			    			</Col>
			    			<Col span={8}>
			    				<div className="playbackControl" onClick={boundPauseUnpause}>
			    					{PlayPauseButton}
			    				</div>
			    			</Col>
			    			<Col span={8}>
			    				<div className={'fastForwardControl' + (toolbar.nextTrack ? '' : ' disabled')}>
			    					<GoPlaybackFastForward />
			    				</div>
			    			</Col>
		    			</Row>
		    		</Col>
            <Col span={2}>
            </Col>
	    			<Col span={10}>
	    				<Row gutter={8}>
	    					<Col span={4}>
			    				<div className={'soundSliderLeftIcon' + (toolbar.volume > 0 ? ' disabled': '')} onClick={boundMute}>
			    					<GoMute />
	    						</div>
	    					</Col>
	    					<Col span={16}>
	    						<Slider onChange={boundChangeVolume} value={toolbar.volume * 100}/>
	    					</Col>
	    					<Col span={4}>
			    				<div onClick={boundUnmute} className={'soundSliderRightIcon' + (toolbar.volume < 1 ? ' disabled': '')}>
			    					<GoUnmute />
			    				</div>
			    			</Col>
			    		</Row>
			    	</Col>
	    		</Row>
	    	</div>
	    </div>
    );
  }
}

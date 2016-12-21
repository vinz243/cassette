import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {Button, Row, Col, Slider} from 'antd';
import 'antd/dist/antd.css';
import './PlayerControls.scss';
import GoPlaybackRewind from 'react-icons/lib/go/playback-rewind';
import GoPlaybackPause from 'react-icons/lib/go/playback-pause';
import GoPlaybackFastForward from 'react-icons/lib/go/playback-fast-forward';

import GoMute from 'react-icons/lib/go/mute';
import GoUnmute from 'react-icons/lib/go/unmute';


export default class PlayerControls extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };

  render() {
    const { toolbar, actions } = this.props;

    return (
    	<div className="controlsContainer">
	    	<div>
	    		<Row gutter={24} className="playerControls">
	    			<Col span={12}>
	    				<Row gutter={16}>
			    			<Col span={8}>
			    				<div className="rewindControl">
			    					<GoPlaybackRewind />
			    				</div>
			    			</Col>
			    			<Col span={8}>
			    				<div className="playbackControl">
			    					<GoPlaybackPause />
			    				</div>
			    			</Col>
			    			<Col span={8}>
			    				<div className="fastForwardControl">
			    					<GoPlaybackFastForward />
			    				</div>
			    			</Col>
		    			</Row>
		    		</Col>
	    			<Col span={12}>
	    				<Row gutter={8}>
	    					<Col span={4}>
			    				<div className="soundSliderLeftIcon">
			    					<GoMute />
	    						</div>
	    					</Col>
	    					<Col span={16}>
	    						<Slider />
	    					</Col>
	    					<Col span={4}>
			    				<div className="soundSliderRightIcon">
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

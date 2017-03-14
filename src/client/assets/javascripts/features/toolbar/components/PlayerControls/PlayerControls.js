import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {Button, Row, Col} from 'antd';
import { Slider } from "@blueprintjs/core";
import 'antd/dist/antd.css';
import './PlayerControls.scss';
import {Flex, Box} from 'reflexbox';

import GoPlaybackRewind from 'react-icons/lib/go/playback-rewind';
import GoPlaybackPause from 'react-icons/lib/go/playback-pause';
import GoPlaybackPlay from 'react-icons/lib/go/playback-play';
import GoPlaybackFastForward from 'react-icons/lib/go/playback-fast-forward';

import GoMute from 'react-icons/lib/go/mute';
import GoUnmute from 'react-icons/lib/go/unmute';

import classNames from 'classnames';

export default class PlayerControls extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };
  rewind(e) {
    const { toolbar, actions } = this.props;
    actions.playPrevious();
  }
  fastForward(e) {
    const { toolbar, actions } = this.props;
    actions.playNext();
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
      PlayPauseButton = <span className="pt-icon-large pt-icon-pause playbackControl" onClick={boundPauseUnpause}></span>;
    } else {
      PlayPauseButton = <span className="pt-icon-large pt-icon-play playbackControl" onClick={boundPauseUnpause}></span>;
    }

    const boundPauseUnpause = this.pauseUnpause.bind(this);
    const boundMute = this.mute.bind(this);
    const boundChangeVolume = this.changeVolume.bind(this);
    const boundUnmute = this.unmute.bind(this);
    const boundRewind = this.rewind.bind(this);
    const boundFastForward = this.fastForward.bind(this);

    return (
    	<div className="controlsContainer">
    		<div className="playerControls">
          <Flex justify="space-between">
            <Box ml={2}>
    					<span className={classNames('rewindControl', {
                  disabled: toolbar.previousTracks.length > 0 || toolbar.currentTrack
                }, 'pt-icon-standard pt-icon-step-backward')}></span>
            </Box>
            <Box auto ml={2}>
    					{PlayPauseButton}
            </Box>
            <Box>
      				<span onClick={boundFastForward}
                className={classNames('fastForwardControl', {
                  disabled: toolbar.nextTracks.length > 0
                }, 'pt-icon-standard pt-icon-step-forward')}>
      				</span>
            </Box>
          </Flex>
  			</div>
	    </div>
    );
  }
}

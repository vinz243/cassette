import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {
  ContextMenuTarget,
  Menu,
  MenuItem,
  Hotkey,
  Hotkeys,
  HotkeysTarget  } from "@blueprintjs/core";
import createMenu from 'app/menu';

import './PlayerControls.scss';
import {Flex, Box} from 'reflexbox';

import classNames from 'classnames';

@HotkeysTarget
@ContextMenuTarget
export default class PlayerControls extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };
  renderHotkeys() {
    const {actions, toolbar} = this.props;
    return <Hotkeys>
        <Hotkey
          global={true}
          combo="k"
          label="Pause/Unpause playback"
          onKeyDown={() => actions.togglePause()} />
        <Hotkey
          global={true}
          combo="l"
          label="Jump to next track"
          onKeyDown={() => actions.playNextTrack()} />
        <Hotkey
          global={true}
          combo="j"
          label="Play previous track"
          onKeyDown={() => actions.playPreviousTrack()} />
    </Hotkeys>
  }
  renderContextMenu() {
    const {actions, toolbar} = this.props;
    return createMenu([{
      text: 'Stop after',
      icon: 'stop',
      shortcut: 'Alt + K',
      action: actions.toggleStopAfter
    }, {
      text: 'Previous',
      icon: 'step-backward',
      shortcut: 'J',
      action: actions.playPreviousTrack
    }, {
      text: toolbar.playing ? 'Pause' : 'Play',
      icon: toolbar.playing ? 'pause' : 'play',
      shortcut: 'K',
      action: actions.togglePause
    }, {
      text: 'Next',
      icon: 'step-forward',
      shortcut: 'L',
      action: actions.playNextTrack
    }
  ]);
  }
  rewind(e) {
    this.props.actions.playPreviousTrack();
  }
  fastForward(e) {
    this.props.actions.playNextTrack();
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

    const boundPauseUnpause = this.pauseUnpause.bind(this);
    const boundMute = this.mute.bind(this);
    const boundChangeVolume = this.changeVolume.bind(this);
    const boundUnmute = this.unmute.bind(this);
    const boundRewind = this.rewind.bind(this);
    const boundFastForward = this.fastForward.bind(this);

    let PlayPauseButton;
    if (toolbar.playing) {
      PlayPauseButton = <span className="pt-icon-large pt-icon-pause playbackControl" onClick={boundPauseUnpause}></span>;
    } else {
      PlayPauseButton = <span className="pt-icon-large pt-icon-play playbackControl" onClick={boundPauseUnpause}></span>;
    }
    return (
    	<div className="controlsContainer">
    		<div className="playerControls">
          <Flex justify="space-between" align="center">
            <Box ml={2}>
    					<span onClick={boundRewind} className={classNames('rewindControl', {
                  disabled: !(toolbar.previousTracks.length > 0 || toolbar.currentTrack)
                }, 'pt-icon-standard pt-icon-step-backward')}></span>
            </Box>
            <Box auto className="play-pause-box">
    					{PlayPauseButton}
            </Box>
            <Box>
      				<span onClick={boundFastForward}
                className={classNames('fastForwardControl', {
                  disabled: !(toolbar.nextTracks.length > 0)
                }, 'pt-icon-standard pt-icon-step-forward')}>
      				</span>
            </Box>
          </Flex>
  			</div>
	    </div>
    );
  }
}

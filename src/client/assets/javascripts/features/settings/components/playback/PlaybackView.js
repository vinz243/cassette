import React, { PropTypes } from 'react';
import {Switch} from '@blueprintjs/core';

class PlaybackView extends React.Component {
  render () {
    return <div className="settings playback">
      <Switch checked={false} label="Gapeless playback"/>
      <Switch checked={false} label="FLAC Support"/>
    </div>
  }
}

export default PlaybackView;

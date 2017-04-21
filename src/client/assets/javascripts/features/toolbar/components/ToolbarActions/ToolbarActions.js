import React, { PropTypes } from 'react'
import {Switch, Tooltip, Position} from '@blueprintjs/core';
import './ToolbarActions.scss';

class ToolbarActions extends React.Component {
  render () {
    const {actions, playlist} = this.props;
    return (
      <div className="toolbar-actions">
        <div className="switch">
          <Tooltip content={<div>
              <div className="direct-tooltip-title">Direct playback</div>
              <div className="direct-tooltip-desc">
                <p>
                  This will stream the audio directly without transcoding.
                  This allows to listen to flac music.
                </p>
              </div>
          </div>} inline={true}
            position={Position.BOTTOM}>
            <Switch checked={playlist.directPlayback} onChange={
                () => actions.toggleLosslessPlayback()
              } />
          </Tooltip>
        </div>
        <div className="logout">
          <span className="pt-icon-large pt-icon-log-out"></span>
        </div>
      </div>
    )
  }
}

export default ToolbarActions;

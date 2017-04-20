import React, { PropTypes } from 'react'
import {Switch, Tooltip, Position} from '@blueprintjs/core';
import './ToolbarActions.scss';

class ToolbarActions extends React.Component {
  render () {
    return (
      <div className="toolbar-actions">
        <div className="switch">
          <Tooltip content="Lossless playback" inline={true}
            position={Position.BOTTOM}>
            <Switch />
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

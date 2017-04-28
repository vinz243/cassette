import React, { PropTypes } from 'react';
import {EditableText, Tooltip} from '@blueprintjs/core';
import classnames from 'classnames';

class TrackerCard extends React.Component {
  constructor () {
    super();
    this.state = {
      host: '',
      type: ''
    }
  }
  render () {
    const {tracker, actions} = this.props;
    const status = this.props.tracker.status;
    const indicator = <span className={classnames(
        "pt-icon-standard", {
          'pt-icon-tick tick': status === 'CONFIRMED',
          'pt-icon-cross cross': status === 'INVALID',
          'pt-icon-radial updating': status === 'UPDATING',
          'pt-icon-ring radial': status === 'UNCONFIRMED',
        }
      )}></span>;
    return <div className="pt-card pt-elevation-0 pt-interactive" onClick={
        () => actions.openTrackerDialog(tracker._id)
      }>
      <h5><span>{tracker.name}</span>
      {tracker.message ? <Tooltip content={tracker.message}
        className="status">
        {indicator}
      </Tooltip> : <div className="status">{indicator}</div>}
      </h5>
      <div>
        <span className="pt-icon-standard pt-icon-user"></span>
        {tracker.username}
      </div>
      <div>
        <span className="pt-icon-standard pt-icon-link"></span>
        {tracker.host}
      </div>
    </div>;
  }
}

export default TrackerCard;

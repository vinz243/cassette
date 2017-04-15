import React, { PropTypes } from 'react'
import './TrackersView.scss';

import TrackerCard from './TrackerCard';

class TrackersView extends React.Component {
  componentDidMount() {
    this.props.actions.loadTrackers();
  }
  render () {
    const {settings, actions} = this.props;
    const trackers = settings.trackers.map((tracker) => {
      return <TrackerCard tracker={tracker} onChange={
          (props) => actions.editTracker(tracker._id, props)
        } key={tracker._id}/>
    })
    trackers.push(<div className="pt-card pt-elevation-0 pt-interactive ph"
    onClick={
      () => actions.addTracker()
    }>
      <span className="pt-icon pt-icon-add add-placeholder"></span>
    </div>)
    return <div className="trackers settings">
        {trackers}
      </div>
  }
}

export default TrackersView;

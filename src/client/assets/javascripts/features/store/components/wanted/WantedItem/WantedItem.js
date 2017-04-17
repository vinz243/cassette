import React, { PropTypes } from 'react'
import BetterImage from 'components/BetterImage';
import './WantedItem.scss';

class WantedItem extends React.Component {
  statusIcon (status = '') {
    return ({
      wanted: 'bookmark',
      searching_trackers: 'geosearch',
      searched: 'confirm',
      failed: 'error',
      downloading: 'cloud-download',
      snatching: 'cloud-download',
      no_results: 'cross',
      done: 'tick',
    })[status.toLowerCase()]
  }
  render () {
    const {item} = this.props;
    return <div className="wanted-item" onClick={
        () => this.props.onSelect(item._id)
      } id={`wanted-item-${item._id}`}>
      <div className="wanted-image">
        <div className="wanted-overlay">
          <div className="wanted-status">
            <span className={`pt-icon-standard pt-icon-${
                this.statusIcon(item.status)
              }`}></span>
          </div>
        </div>
        <BetterImage
          src={`/api/v2/store/release-groups/${item.mbid}/artwork?size=150`}
          size={140} />
      </div>
      <div className="wanted-props">
        <div className="wanted-title">
          {item.title || '...'}
        </div>
        <div className="wanted-artist">
          {item.artist || '...'}
        </div>
      </div>
    </div>
  }
}

export default WantedItem;

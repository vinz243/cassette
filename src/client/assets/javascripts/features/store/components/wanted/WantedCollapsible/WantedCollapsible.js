import React, { PropTypes } from 'react'
import {Collapse, Button, Intent} from '@blueprintjs/core';
import './WantedCollapsible.scss';

class WantedCollapsible extends React.Component {
  render () {
    const {item = {}, isOpen} = this.props;
    let items = null;

    if (!['searched_trackers', 'searching_trackers', 'searched']
      .includes((item.status || '').toLowerCase()) && item) {

      items = <div className="wanted-empty">
        <div className="wanted-text">
          Trackers not searched
        </div>
        <div className="wanted-button">
          <Button
            iconName="geosearch"
            intent={Intent.PRIMARY}
            text="Search trackers"
            loading={
              (item.status || '').toLowerCase() === 'searching_trackers' || item.stale
            } onClick={this.props.onSearch.bind(null, item._id)}/>
        </div>
      </div>
    } else {
      items = <div>There are a few results</div>
    }

    return <div className="wanted-collapse" key="collapsible">
      <Collapse isOpen={isOpen}>
        <div className="wanted-content">
          <div className="wanted-close" onClick={this.props.onClose}>
            <span className="pt-icon-standard pt-icon-cross"></span>
          </div>
          <div className="wanted-container">
            <div className="wanted-title">
              {item.title}
            </div>
            <div className="wanted-artist">
              {item.artist}
            </div>
            <div className="wanted-results">
              {items}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  }
}

export default WantedCollapsible;

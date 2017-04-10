import React, { PropTypes } from 'react'
import {Collapse, Button, Intent} from '@blueprintjs/core';
import './WantedCollapsible.scss';
import classnames from 'classnames';

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
      const results = item.results.map((el) => <div
        className="wanted-result" key={el._id}>
        {el.name}
        <div className="wanted-badges">
          <span className="pt-tag pt-minimal">
            {el.format}
          </span>
          <span className={classnames('pt-tag', {
              'pt-intent-warning': el.seeders < el.leechers,
              'pt-minimal': el.seeders >= el.leechers
            })}>
            <span className="pt-icon pt-icon-symbol-triangle-down"></span>{el.leechers}
          </span>
          <span className={classnames('pt-tag', {
              'pt-intent-success pt-minimal': el.seeders > 2,
              'pt-intent-warning': el.seeders <= 2
            })}>
            <span className="pt-icon pt-icon-symbol-triangle-up"></span>{el.seeders}
          </span>
          <span className={classnames('pt-tag', {
              'pt-intent-primary': el.score > 0,
              'pt-intent-danger': el.score <= 0
            })}>
            {el.score}
          </span>
        </div>
      </div>)
      items = <div className="wanted-results-list">{results}</div>;
    }
    const cover = document.getElementById(`wanted-item-${item._id}`);
    return <div className="wanted-collapse" key="collapsible">
      <Collapse isOpen={isOpen}>
        <div className="wanted-arrow" style={{
            marginLeft: cover ? cover.offsetLeft - 24 : '0' + 'px'
          }}></div>
        <div className="wanted-arrow-2" style={{
            marginLeft: cover ? cover.offsetLeft - 24 : '0' + 'px'
          }}></div>
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

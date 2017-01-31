import React, { Component, PropTypes } from 'react';
import './ListItem.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import deepAssign from 'deep-assign';

export default class ListItem extends Component {
  static propTypes = {
  };

  handleTrackNameClick() {
    this.props.select([
      deepAssign({}, this.props.track)
    ]);
  }

  render() {
    const { library, actions, track } = this.props;
    const boundHandleTrackNameClick = this.handleTrackNameClick.bind(this);
    return (
    	<div>
        <Row gutter={32}>
          <Col span={8} className={track.duration > 0 ? "trackName" : "disabledTrackName"} onClick={boundHandleTrackNameClick}>
            {track.name}
          </Col>
          <Col span={8} className="trackArtist">
            {track.artist.name}
          </Col>
          <Col span={8} className="trackAlbum">
            {track.album.name}
          </Col>
        </Row>
      </div>
    );
  }
}

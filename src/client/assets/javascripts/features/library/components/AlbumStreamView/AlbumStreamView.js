import React, { Component, PropTypes } from 'react';
import './AlbumStreamView.scss';
import {Row, Col} from 'antd';

export default class AlbumStreamView extends Component {
  static propTypes = {
  };

  handleTrackNameClick() {
  }

  msToTime(ms) {
    let millis = Math.abs(Math.round(ms));
    let secs = millis / 1000;

    let minutes = Math.round((secs - secs % 60) / 60);
    let seconds = Math.round((secs % 60));
    let sign = ((ms < 0) ? '-' : '');

    let minStr = minutes > 9 ? minutes + '' : '0' + minutes;
    let secStr = seconds > 9 ? seconds + '' : '0' + seconds;

    return sign + minStr + ':' + secStr;
  }

  render() {
    const { album } = this.props;
    let tracksDOM = album.tracks.map((t) => (
      <div className="trackItem" key={t.id}>
        <Row onClick={t.play}>
          <Col span={1} className="trackNumber">
            {t.number}
          </Col>
          <Col span={17}>
            {t.name}
            <span className="nameExt">
              {t.originalName.substr(t.name.length)}
            </span>
          </Col>
          <Col span={6} className="duration">
            {this.msToTime(t.duration)}
          </Col>
        </Row>
      </div>
    ))
    return (
    	<div>
        <Row gutter={32} className="albumStreamItem">
          <Col span={6}>
            <img className="albumArt" src={"http://lorempixel.com/g/400/400?"+album.id} />
          </Col>
          <Col span={18}>
            <div className="albumHeader">
              {album.artist.name} &#8210;
              <span className="album">
                {' ' + album.name}
              </span>
            </div>
            {tracksDOM}
          </Col>
        </Row>
      </div>
    );
  }
}

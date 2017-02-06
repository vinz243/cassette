import React, { Component, PropTypes } from 'react';
import './AlbumStreamView.scss';
import {Row, Col, Spin} from 'antd';
import classnames from 'classnames';
import { browserHistory } from 'react-router';

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
      <div className={classnames('trackItem', {'playing': t.playing})} key={t.id}>
        <Row onClick={t.play} gutter={16}>
          <Col span={2} className="trackNumber">
            {t.playing ? <div className={classnames('spinner', {'paused': this.props.paused})}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>: t.number}
          </Col>
          <Col span={16}>
            {t.name}
            <span className="nameExt">
              {t.originalName.substr(t.name.length).replace(/\(|\)/g, '')}
            </span>
          </Col>
          <Col span={3} className="duration">
            {this.msToTime(t.duration)}
          </Col>
        </Row>
      </div>
    ))
    return (
    	<div>
        <Row gutter={32} className="albumStreamItem">
          <Col span={6}>
            <img className="albumArt" src={`/v1/albums/${album.id}/art`} />
          </Col>
          <Col span={18}>
            <div className="albumHeader">
              <span   className="artist" onClick={browserHistory.push.bind(null, `/app/library/artists/${album.artist.id}/albums`)}>
                {album.artist.name}
              </span>
              &#8210;
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

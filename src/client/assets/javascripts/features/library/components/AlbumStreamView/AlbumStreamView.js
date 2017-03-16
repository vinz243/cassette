import React, { Component, PropTypes } from 'react';
import './AlbumStreamView.scss';
import {Flex, Box} from 'reflexbox';
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
  playTracks (number) {
    const { album } = this.props;
    this.props.playTracks(album.tracks.filter(t => t.trackNumber >= number));
  }
  render() {
    const { album } = this.props;
    let tracksDOM = album.tracks.map((t) => (
      <div className={classnames('trackItem', {'playing': t.playing})} key={t._id}>
        <Flex onClick={this.playTracks.bind(this, t.trackNumber)}>
          <Box className="trackNumber" ml={1}>
            {t.playing ? <div className={classnames('spinner', {'paused': this.props.paused})}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>: t.trackNumber}
          </Box>
          <Box auto ml={2} >
            <span className="trackTitle">
              {t.name}
            </span>
            <span className="nameExt">
              {/*t.name*/}
            </span>
          </Box>
          <Box className="duration" mr={1}>
            {this.msToTime(t.duration * 1000)}
          </Box>
        </Flex>
      </div>
    ))
    return (
    	<div>
        <Flex className="albumStreamItem">
          <Box col={2} m={2}>
            <img className="albumArt" src={`/api/v2/albums/${album._id}/artwork`} />
          </Box>
          <Box col={10} m={2}>
            <div className="albumHeader">
              <span   className="artist" onClick={browserHistory.push.bind(null, `/app/library/artists/${album.artist._id}/albums`)}>
                {album.artist.name}
              </span>
              &#8210;
              <span className="album">
                {' ' + album.name}
              </span>
            </div>
            {tracksDOM}
          </Box>
        </Flex>
      </div>
    );
  }
}

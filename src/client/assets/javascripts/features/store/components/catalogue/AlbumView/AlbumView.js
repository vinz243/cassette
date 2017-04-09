import React, { PropTypes } from 'react'
import './AlbumView.scss';

import BetterImage from 'components/BetterImage';
import Spinner from 'react-spinkit';
import NonIdealState from 'components/NonIdealState';
import ScrollableDiv from 'components/ScrollableDiv';
import {Flex, Box} from 'reflexbox';
import {Tooltip, Position} from '@blueprintjs/core';

class AlbumView extends React.Component {
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
  render () {
    const {album} = this.props;
    if (album.loading) {
      return <div className="spinner">
        <Spinner spinnerName="three-bounce" noFadeIn />
      </div>

    } else if (album.errored) {
      return <NonIdealState
        title="Could not fetch the release"
        description={`${album.error.message} <br />
        The release is probably unofficial (such as a bootleg)`}
        icon="error" />
    } else {
      const tracks = album.media.map((medium, i, arr) => {
       const title = arr.length > 1 ? <div className="mediaTitle">
         {medium.title || (medium.format + ' #' + medium.position)}
       </div> : null;
       const tracks = medium.tracks.map((track) => {
         return <div className="track">
           <span className="number">{track.number}.</span>
           <span className="title">{track.title}</span>
           <span className="duration">{this.msToTime(track.length)}</span>
         </div>
       });
       return <div>
         {title}
         {tracks}
       </div>
      });

      const trackCount = album.media.reduce((acc, medium) => {
        return acc + medium.tracks.length;
      }, 0);


      return <div>
        <Flex>
          <Box>
            <BetterImage
               src={`/api/v2/store/release-groups/${
                 album.groupId
               }/artwork?size=112`} size="112"/>
          </Box>
          <Box className="albumInfo">
            <div className="albumName">{album.title}
            </div>
            <div className="artistName">{album.artist}</div>
            <div className="trackCount">{trackCount} tracks</div>
            <div className="pt-button-group pt-minimal">
              <Tooltip position={Position.BOTTOM}
                content="Silently downloads best available torrent">
                <a className="pt-button pt-icon-cloud-download"
                  tabindex="0" role="button">Download</a>
              </Tooltip>
              <Tooltip position={Position.BOTTOM}
                content="Shows you all available torrents and lets you choose one">
                <a className="pt-button pt-icon-geosearch"
                  tabindex="0" role="button">Search</a>
              </Tooltip>
            </div>
          </Box>
        </Flex>
        <div className="tracks">
          <ScrollableDiv>
            {tracks}
          </ScrollableDiv>
        </div>
      </div>
    }


  }
}

export default AlbumView;

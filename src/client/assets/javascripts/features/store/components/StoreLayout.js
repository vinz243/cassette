import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import classnames from 'classnames';
import {Flex, Box} from 'reflexbox';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Spinner from 'react-spinkit';
import BetterImage from 'components/BetterImage';
import {Tooltip, Position} from '@blueprintjs/core';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  constructor () {
    super();
    this.state = {
      searchString: ''
    };
  }
  componentDidMount () {
    this.input.focus();
    window.addEventListener('resize', (evt) => {
      window.requestAnimationFrame(() => {
        this.updateHeight();
      })
    });
    this.updateHeight();
  }
  updateHeight () {
    this.artistsDiv.style.height =
      (window.innerHeight - this.artistsDiv.getBoundingClientRect().top - 38.4
        - this.artistsDiv.parentElement.scrollTop) + "px";
    this.albumsDiv.style.height =
      (window.innerHeight - this.albumsDiv.getBoundingClientRect().top - 38.4
        - this.albumsDiv.parentElement.scrollTop) + "px";
    if (this.tracksDiv) {
      this.tracksDiv.style.height =
      (window.innerHeight - this.tracksDiv.getBoundingClientRect().top - 38.4
        ) + "px";
    }
  }
  componentDidUpdate () {
    this.updateHeight();
  }
  searchStringChange (e) {
    this.setState({
      searchString: e.target.value
    });
  }
  search (evt) {
    const { store, actions } = this.props;
    if (evt.key === 'Enter') {
      actions.fetchArtistsResult(this.state.searchString);
      actions.fetchAlbumsResult(this.state.searchString);
    }
  }
  getResults () {
    const state = this.props.store;
    return {
      artists: state.artistsByQuery[state.query.artists],
      albums: state.albumsByQuery[state.query.albums],
      album: state.albumsById[state.query.album]
    }
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
  render () {
    const { store, actions } = this.props;
    const results = this.getResults();

    const artists = store.query.artists ?
      (results.artists ? results.artists.map((el) => (
        <div className={classnames('artistItem', {
            selected: el.id === store.query.albums,
            anySelected: store.query.albums && store.query.albums !== store.query.artists
          })} key={el.id} onClick={() => {
            actions.fetchArtistAlbums(el.id);
          } }>
          <span>{el.name}</span>
          <div className="dis">{el.disambiguation}</div>
        </div>
      )) : <div className="spinner">
      <Spinner spinnerName="three-bounce" noFadeIn />
    </div>) : <div className="pt-non-ideal-state">
      <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
        <span className="pt-icon pt-icon-geosearch"></span>
      </div>
      <h4 className="pt-non-ideal-state-title">No search query</h4>
      <div className="pt-non-ideal-state-description">
        Type something to see results
      </div>
    </div>

    const albums = store.query.albums ? (results.albums ?
      results.albums.map((el) => (
        <div className={classnames('artistItem', {
            selected: el.id === store.query.album,
            anySelected: store.query.album
          })}
          key={el.id} onClick={
            () => actions.fetchAlbum(el.id)
          }>
          <span>{el.title}</span>
          <div className="dis">{el['primary-type']} by {(el['artist-credit'] ||
           [{artist: {name: 'Unknown'}}])[0].artist.name}</div>
        </div>
      )) : <div className="spinner">
      <Spinner spinnerName="three-bounce" noFadeIn />
      </div>) : null;

    let album = null;

    if (results.album) {
      if (results.album.loading) {
        album = <div className="spinner">
          <Spinner spinnerName="three-bounce" noFadeIn />
        </div>

      } else if (results.album.errored) {
        album = <div className="pt-non-ideal-state">
          <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
            <span className="pt-icon pt-icon-error"></span>
          </div>
          <h4 className="pt-non-ideal-state-title">Could not fetch the release</h4>
          <div className="pt-non-ideal-state-description">
            {results.album.error.message} <br />
            The release is probably unofficial (such as a bootleg)
          </div>
        </div>
      } else {
        const tracks = results.album.media.map((medium, i, arr) => {
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

        const trackCount = results.album.media.reduce((acc, medium) => {
          return acc + medium.tracks.length;
        }, 0);

        album = <div>
          <Flex>
            <Box>
              <BetterImage
                 src={`/api/v2/store/release-groups/${
                   results.album.groupId
                 }/artwork?size=112`} size="112"/>
            </Box>
            <Box className="albumInfo">
              <div className="albumName">{results.album.title}
              </div>
              <div className="artistName">{results.album.artist}</div>
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
            <div ref={(ref) => this.tracksDiv = ref} style={{
                overflowY: 'auto',
                overflowX: 'hidden',
              }} className="minimalScroll">
              {tracks}
            </div>
          </div>
        </div>
      }
    }

    return (
    	<div className="storeContainer">
        <div className="storeNav">
          <span className="pt-icon pt-icon-chevron-left"></span>
          <span className="pt-icon pt-icon-chevron-right"></span>
          <div className="pt-input-group .modifier">
            <span className="pt-icon pt-icon-search"></span>
            <input className="pt-input"
              ref={(el) => this.input = el}
              type="search" placeholder="Search input"
              onChange={this.searchStringChange.bind(this)}
              onKeyPress={this.search.bind(this)} dir="auto" />
          </div>
          <span className="downloads">
            Downloads
          </span>
        </div>
        <div className="results">
          <Flex>
            <Box className="artistResults" col={3}>
              <div ref={(ref) => this.artistsDiv = ref}>
                {artists}
              </div>
            </Box>
            <Box className="albumResults" col={3}>
              <div ref={(ref) => this.albumsDiv = ref}>
                {albums}
              </div>
            </Box>
            <Box className="album" col={6}>
              {album}
            </Box>
          </Flex>
        </div>
      </div>
    );
  }
}

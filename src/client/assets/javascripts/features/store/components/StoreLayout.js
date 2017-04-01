import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import classnames from 'classnames';
import {Flex, Box} from 'reflexbox';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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
  searchStringChange (e) {
    this.setState({
      searchString: e.target.value
    });
  }
  search (evt) {
    const { store, actions } = this.props;
    if (evt.key === 'Enter') {
      actions.loadArtists();
      actions.loadAlbums();
      actions.searchArtists(this.state.searchString);
      actions.searchAlbums(this.state.searchString);
    }
  }
  render () {
    const { store, actions } = this.props;
    const artists = store.artistsLoading ?
      <div></div> : store.artists.map((el) => (
      <div className={classnames('artistItem', {
          selected: el.id === store.selectedArtist,
          anySelected: store.selectedArtist
        })} key={el.id} onClick={() => {
          actions.selectArtist(el.id);
          actions.openArtist(el.id);
        } }>
        <span>{el.name}</span>
      </div>
    ));

    const albums = !store.artistsLoading ? store.albums.map((el) => (
      <div className={classnames('artistItem')}
        key={el.id} onClick={
          () => actions.openAlbum(el.id)
        }>
        <span>{el.title}</span>
      </div>
    )) : <div></div>;
    const tracks = store.album.media.map((medium) => {
        const title = medium.title ? <div className="title"></div> : <div></div>;
        const tracks = medium.tracks.map((track) => {
          return <div className="track">
            <span className="number">{track.number}</span>
            <span className="title">{track.title}</span>
          </div>
        });
        return <div>
          {title}
          {tracks}
        </div>
    });

    const album = <div>
        <Flex>
          <Box>
              <img src={`/api/v2/store/release-groups/${store.album.groupId}/artwork?size=150`} />
          </Box>
          <Box className="albumInfo">
            <div className="artistName">{store.album.artist}</div>
            <div className="albumName">{store.album.title}</div>
            <div className="trackCount">13 tracks</div>
          </Box>
        </Flex>
        <div className="tracks">
          {tracks}
        </div>
    </div>
    return (
    	<div className="storeContainer">
        <div className="storeNav">
          <span className="pt-icon pt-icon-chevron-left"></span>
          <span className="pt-icon pt-icon-chevron-right"></span>
          <div className="pt-input-group .modifier">
            <span className="pt-icon pt-icon-search"></span>
            <input className="pt-input"
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
            <Box className="artistResults">
              <ReactCSSTransitionGroup
                transitionName="group"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={300}>
                {artists}
              </ReactCSSTransitionGroup>
            </Box>
            <Box className="albumResults">
              <ReactCSSTransitionGroup
                transitionName="group"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={300}>
                {albums}
              </ReactCSSTransitionGroup>
            </Box>
            <Box className="album">
              {store.album.id ? album : <div></div>}
            </Box>
          </Flex>
        </div>
      </div>
    );
  }
}

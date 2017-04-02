import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import classnames from 'classnames';
import {Flex, Box} from 'reflexbox';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Spinner from 'react-spinkit';

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
      (window.innerHeight - this.artistsDiv.getBoundingClientRect().top - 38.4) + "px";
    this.albumsDiv.style.height =
      (window.innerHeight - this.albumsDiv.getBoundingClientRect().top - 38.4) + "px";
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
      albums: state.albumsByQuery[state.query.albums]
    }
  }
  firstChild (props) {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
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
        <div className={classnames('artistItem')}
          key={el.id} onClick={
            () => actions.openAlbum(el.id)
          }>
          <span>{el.title}</span>
          <div className="dis">{el['primary-type']} by {(el['artist-credit'] ||
           [{artist: {name: 'Unknown'}}])[0].artist.name}</div>
        </div>
      )) : <div className="spinner">
      <Spinner spinnerName="three-bounce" noFadeIn />
      </div>) : null;

    // const tracks = store.album.media.map((medium) => {
    //     const title = medium.title ? <div className="title"></div> : <div></div>;
    //     const tracks = medium.tracks.map((track) => {
    //       return <div className="track">
    //         <span className="number">{track.number}</span>
    //         <span className="title">{track.title}</span>
    //       </div>
    //     });
    //     return <div>
    //       {title}
    //       {tracks}
    //     </div>
    // });

    // const album = <div>
    //     <Flex>
    //       <Box>
    //           <img src={`/api/v2/store/release-groups/${store.album.groupId}/artwork?size=150`} />
    //       </Box>
    //       <Box className="albumInfo">
    //         <div className="artistName">{store.album.artist}</div>
    //         <div className="albumName">{store.album.title}</div>
    //         <div className="trackCount">13 tracks</div>
    //       </Box>
    //     </Flex>
    //     <div className="tracks">
    //       {tracks}
    //     </div>
    // </div>
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
              {/*store.album.id ? album : <div></div>*/}
            </Box>
          </Flex>
        </div>
      </div>
    );
  }
}

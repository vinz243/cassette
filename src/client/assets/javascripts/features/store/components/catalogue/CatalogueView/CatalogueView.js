import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './CatalogueView.scss';
import classnames from 'classnames';
import {Flex, Box} from 'reflexbox';
import NonIdealState from 'components/NonIdealState';
import ScrollableDiv from 'components/ScrollableDiv';
import AlbumResult from '../AlbumResult';
import AlbumView from '../AlbumView';
import ArtistsView from '../ArtistsView';
import FilterButton from '../FilterButton';
import Spinner from 'react-spinkit';

export default class CatalogueView extends Component {
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
  render () {
    const { store, actions } = this.props;
    const results = this.getResults();

    const artists = store.query.artists ? <ArtistsView
      artists={results.artists}
      childQuery={store.query.albums}
      query={store.query.artists}
      select={actions.fetchArtistAlbums}/> :
      <NonIdealState
        className="no-query"
        title="No search query"
        description="Please type something in the search above to see results"
        icon="geosearch" />

    const albums = store.query.albums ? (results.albums ?
      results.albums.map((el) => {
        return <AlbumResult item={el} query={store.query.album} onSelect={
            id => actions.fetchAlbum(id)
          } key={el.id} filter={store.albumsFilter} loadMore={actions.fetchMoreAlbums}/>
      }) : <div className="spinner">
        <Spinner spinnerName="three-bounce" noFadeIn />
      </div>) : null;

    const album = results.album ? <AlbumView album={results.album} /> : null;

    return (
      <div className="results">
        <Flex>
          <Box className="resultsTitle" col={3}>
            <div className="title">Artists</div>
          </Box>
          <Box className="resultsTitle" col={3}>
            <div className="title" style={{
                marginLeft: '1em'
              }}>Albums
              <FilterButton {...this.props} />
            </div>
          </Box>
          <Box className="album" col={6}>
          </Box>
        </Flex>
        <Flex>
          <Box className="artistResults" col={3}>
            <ScrollableDiv>
              {artists}
            </ScrollableDiv>
          </Box>
          <Box className="albumResults" col={3}>
            <ScrollableDiv>
              {albums}
            </ScrollableDiv>
          </Box>
          <Box className="album" col={6}>
            {album}
          </Box>
        </Flex>
        </div>
    );
  }
}

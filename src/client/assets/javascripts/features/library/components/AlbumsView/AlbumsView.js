import React, { Component, PropTypes } from 'react';
import './AlbumsView.scss';
import uniqBy from 'lodash/uniqBy';
import chunk from 'lodash/chunk';
import {Box, Flex} from 'reflexbox';
import classnames from 'classnames';
import ViewScope from '../ViewScope';
import { browserHistory } from 'react-router';
import LoaderProxy from '../LoaderProxy';
import BetterImage from 'components/BetterImage';
import ScrollableDiv from 'components/ScrollableDiv';

export default class AlbumsView extends Component {
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent({scope: 'ALBUMS', artist: this.props.params.id});

  }
  componentWillReceiveProps(nextProps) {
    const { library, actions } = this.props;
    if (nextProps.location && nextProps.location.key !== this.props.location.key) {
      actions.loadContent({scope: 'ALBUMS', artist: nextProps.params.id});
    }
  }
  render() {
    let artistId = this.props.params.id;
    let artistName = (this.props.library.items.albums.find(
      ((el) => el.artist._id === artistId)
    )  || {artist: {}}).artist.name;

    const albums = this.props.library.items.albums.reduce((acc, album) => {
      return Object.assign({}, acc, {
        [album.artist._id]: [].concat(acc[album.artist._id] || [], album)
      });
    }, {});

    const content = Object.keys(albums).map((id) => {
      const artistAlbums = albums[id];
      const ctt = artistAlbums.map((album, index) => {
        return <div className="albumCard" onClick={
            browserHistory.push.bind(null, `/app/library/albums/${
              album._id}/tracks`)} key={album._id}>
          <BetterImage src={`/api/v2/albums/${
              album._id
            }/artwork?size=200`} size={200} className="album-cover"/>
          <div className="desc">
            <span>
              <div className="album">{album.name}</div>
              <div className="artist">{album.artist.name}</div>
            </span>
          </div>
        </div>
      });
      return <div className="albumRow" key={id}>
        <div className="albumArtist">{artistAlbums[0].artist.name}</div>
        {ctt}
      </div>
    });

    return <LoaderProxy {...this.props}>
      <ScrollableDiv>
        <div className="albumsView">
          {content}
        </div>
      </ScrollableDiv>
    </LoaderProxy>
  }
}

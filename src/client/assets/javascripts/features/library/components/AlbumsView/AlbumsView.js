import React, { Component, PropTypes } from 'react';
import './AlbumsView.scss';
import uniqBy from 'lodash/uniqBy';
import chunk from 'lodash/chunk';
import {Box, Flex} from 'reflexbox';
import classnames from 'classnames';
import ViewScope from '../ViewScope';
import { browserHistory } from 'react-router';
import LoaderProxy from '../LoaderProxy';

export default class AlbumsView extends Component {
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent({scope: 'ALBUMS', artist: this.props.params.id});

  }
  render() {
    let artistId = this.props.params.id;
    let artistName = (this.props.library.items.albums.find(
      ((el) => el.artist._id === artistId)
    )  || {artist: {}}).artist.name;
    let albums = this.props.library.items.albums.map((album, index) => {
        return <div className="albumCard" onClick={
            browserHistory.push.bind(null,
              `/app/library/albums/${album._id}/tracks`)}
              style={{
                'background-image': `url(/api/v2/albums/${
                  album._id
                }/artwork?size=200)`
              }} key={album._id}>
          <div className="desc">
            <span>
              <div className="album">{album.name}</div>
              <div className="artist">{album.artist.name}</div>
            </span>
          </div>
        </div>
    });

    return <LoaderProxy {...this.props}>
      <div className="albumsView">
        {albums}
      </div>
    </LoaderProxy>
  }
}

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
    const COLUMNS = 12;
    let artistId = this.props.params.id;
    let artistName = (this.props.library.items.albums.find(
      ((el) => el.artist._id === artistId)
    )  || {artist: {}}).artist.name;
    let albums = chunk(this.props.library.items.albums,
      COLUMNS).map((arr, index) => {
        let arts = arr.map((album) => (
          <Box col={Math.floor(12 / COLUMNS)} className="albumCard" key={album._id}>
            <div className="albumCard" onClick={
                browserHistory.push.bind(null,
                  `/app/library/albums/${album._id}/tracks`)}
                  style={{
                    'background-image': `url(/api/v2/albums/${
                      album._id
                    }/artwork?size=200)`
                  }}>
              <div className="desc">
                <span>
                  <div className="album">{album.name}</div>
                  <div className="artist">{album.artist.name}</div>
                </span>
              </div>
            </div>
          </Box>
        ));
        return <Flex key={`albums-row-${index}`}>
          {arts}
        </Flex>
      });

    return <LoaderProxy {...this.props}>
      <div className="albumsView">
        {albums}
      </div>
    </LoaderProxy>
  }
}

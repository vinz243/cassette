import React, { Component, PropTypes } from 'react';
import './AlbumsView.scss';
import uniqBy from 'lodash/uniqBy';
import chunk from 'lodash/chunk';
import {Row, Col, Card} from 'antd';
import classnames from 'classnames';
import ViewScope from '../ViewScope';
import { browserHistory } from 'react-router';

export default class AlbumsView extends Component {
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent({scope: 'ALBUMS'});

  }
  render() {
    const COLUMNS = 6;
    let artistId = this.props.params.id;
    let artistName = (this.props.library.items.albums.find(
      ((el) => el.artist._id === artistId)
    )  || {artist: {}}).artist.name;
    let albums = chunk(this.props.library.items.albums,
      COLUMNS).map((arr, index) => {
        let arts = arr.map((album) => (
          <Col span={Math.floor(24 / COLUMNS)} className="albumCard" key={album._id}>
            <Card bodyStyle={{ padding: 0 }} onClick={
                browserHistory.push.bind(null,
                  `/app/library/albums/${album._id}/tracks`)} >
              <div className="custom-image">
                <img alt="example" width="100%" src={
                    `/api/v2/albums/${album._id}/artwork?size=200`
                  } />
              </div>
              <div className="custom-card">
                <h3>{album.name} — <span>{album.artist.name}</span></h3>
              </div>
            </Card>
          </Col>
        ));
        return <Row key={`albums-row-${index}`}>
          {arts}
        </Row>
      });

    return <div className="albumsView">
      <ViewScope selection='albums' title={artistName}/>
      {albums}
    </div>
  }
}

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
    actions.loadContent();

  }
  render() {
    const COLUMNS = 6;
    let artistId = this.props.params.id;
    let artistName = (this.props.library.items.find(
      ((el) => el.artist.id === artistId)
    )  || {artist: {}}).artist.name;
    let albums = chunk(uniqBy(
      this.props.library.items.map((el) => Object.assign({}, el.album, {
        artist: el.artist
      })).filter(el =>  artistId ? el.artist.id === artistId : true)
      , (el) => el.id), COLUMNS)
      .map((arr, index) => {
        let arts = arr.map((album) => (
          <Col span={Math.floor(24 / COLUMNS)} className="albumCard" key={album.id}>
            <Card bodyStyle={{ padding: 0 }} onClick={browserHistory.push.bind(null, `/app/library/albums/${album.id}/tracks`)}>
              <div className="custom-image">
                <img alt="example" width="100%" src={
                    `/v1/albums/${album.id}/art`
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

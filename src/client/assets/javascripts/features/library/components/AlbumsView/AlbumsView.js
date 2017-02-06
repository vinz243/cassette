import React, { Component, PropTypes } from 'react';
import './AlbumsView.scss';
import uniqBy from 'lodash/uniqBy';
import chunk from 'lodash/chunk';
import {Row, Col, Card} from 'antd';
import classnames from 'classnames';
import ViewScope from '../ViewScope';

export default class AlbumsView extends Component {
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent();

  }
  render() {
    const COLUMNS = 6;
    let albums = chunk(uniqBy(
      this.props.library.items.map((el) => Object.assign({}, el.album, {
        artist: el.artist
      })),
      (el) => el.id), COLUMNS).map((arr, index) => {
        let arts = arr.map((album) => (
          <Col span={Math.floor(24 / COLUMNS)} className="albumCard" key={album.id}>
            <Card bodyStyle={{ padding: 0 }}>
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

    return <div className="albumsView"><ViewScope selection='albums'/> {albums}</div>
  }
}

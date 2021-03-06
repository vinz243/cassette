import React, { Component, PropTypes } from 'react';
import './ArtistsView.scss';
import uniqBy from 'lodash/uniqBy';
import chunk from 'lodash/chunk';
import ViewScope from '../ViewScope';
import {Row, Col, Card} from 'antd';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
export default class ArtistsView extends Component {
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent();

  }
  render() {
    const COLUMNS = 6;
    let artists = chunk(uniqBy(
      this.props.library.items.map((el) => el.artist),
      (el) => el.id), COLUMNS).map((arr, index) => {
        let arts = arr.map((artist) => (
          <Col span={Math.floor(24 / COLUMNS)} className="artistCard" key={artist.id}>
            <Card bodyStyle={{ padding: 0 }} onClick={browserHistory.push.bind(null, `/app/library/artists/${artist.id}/albums`)}>
              <div className="custom-image">
                <img alt="example" width="100%" src={
                    `/v1/artists/${artist.id}/art?size=200`
                  } />
              </div>
              <div className="custom-card">
                <h3>{artist.name}</h3>
              </div>
            </Card>
          </Col>
        ));
        return <Row key={`artist-row-${index}`}>
          {arts}
        </Row>
      });

    return <div className="artistsView"><ViewScope selection='artists'/>  {artists}</div>
  }
}

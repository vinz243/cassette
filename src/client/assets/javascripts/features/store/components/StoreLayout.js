import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import {Row, Col, Input, Modal, notification, Card, Switch, Table, Button} from 'antd';
import 'antd/dist/antd.css';
import chunk from 'lodash/chunk';
import axios from 'axios';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  constructor() {
    super();
    this.state = {
      searchString: ''
    };
  }
  searchStringChange(e) {
    this.setState({
      searchString: e.target.value
    });
  }
  search(e) {
    const { search, actions } = this.props;
    actions.searchAndUpdateResults(this.state.searchString);
  }
  makeSelectItem(el) {
    const { store, actions } = this.props;
    return () => {
      actions.findReleases(el, store.lossless);
    }
  }
  componentDidMount() {
    const { search, actions } = this.props;
  }
  download(id) {
    return () => {
      this.props.actions.hideReleases();
      axios.post(`/v1/releases/${id}/downloads`).then((res) => {
        if (res.data.sucess) { // sic: fix typo
          notification.success({
            message: 'Torrent added',
            description: 'Torrent was added to downloader. It should be downloading right now!'
          });
        } else {
          notification.error({
            message: 'Torrent was not added',
            description: 'Torrent not was added to downloader. Please check logs for more info'
          });
        }
      });
    }
  }
  setLossless (flag) {
    this.props.actions.setLossless(flag);
  }
  render() {
    const { store, actions } = this.props;
    const boundSearchStringChange = this.searchStringChange.bind(this);
    const boundSearch = this.search.bind(this);
    const COLUMNS = 6;
    const albums = chunk(store.results.albums, COLUMNS).map((arr, index) => {
      let arts = arr.map((album) => (
        <Col span={Math.floor(24 / COLUMNS)} className="searchAlbumCard"
          key={album.id}>
          <Card bodyStyle={{ padding: 0 }}
            onClick={this.makeSelectItem(album.id)}>
            <div className="custom-image">
              <img alt="example" width="100%" src={album.art} />
            </div>
            <div className="custom-card">
              <h3>{album.album} — <span>{album.artist}</span></h3>
            </div>
          </Card>
        </Col>
      ));
      return <Row key={`albums-row-${index}`}>
        {arts}
      </Row>
    })
    const releases = store.releases.map((el) => ({
      album: el.album,
      artist: el.artist,
      format: el.format,
      encoding: el.encoding,
      seeders: el.seeders,
      score: el.score.total,
      id: el._id
    }));
    const columns = [{
      title: 'Album',
      dataIndex: 'album',
      key: 'album'
    }, {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist'
    }, {
      title: 'Format',
      dataIndex: 'format',
      key: 'format'
    }, {
      title: 'Encoding',
      dataIndex: 'encoding',
      key: 'encoding'
    }, {
      title: 'Seeders',
      dataIndex: 'seeders',
      key: 'seeders'
    }, {
      title: 'Score',
      dataIndex: 'score',
      key: 'score'
    }, {
      title: 'Actions',
      key: 'actions',
      render: (text, r) => (
        <span>
          <Button onClick={this.download(r.id)}>Download</Button>
        </span>
      )
    }];
    const rowKey = (record) => {
      return record._id;
    }
    return (
    	<div className="storeContainer" >
          <Row gutter={24}>
            <Col span={8}></Col>
            <Col span={8}>
              <Input.Search value={this.state.searchString}
                className="storeSearch" size="large"
                onChange={boundSearchStringChange}
                onPressEnter={boundSearch}
                placeholder="Search for a track, an album..."/>
            </Col>
            <Col span={8}>
              <Switch checked={store.lossless} onChange={this.setLossless.bind(this)}/>
              <span className="lossless">Lossless</span>
            </Col>
          </Row>
          <Modal title="Found releases" visible={store.showReleases}
              cancelText="Cancel"
              width={900}
              okText="OK"
              onOk={actions.hideReleases}
              onCancel={actions.hideReleases}>
              <Table dataSource={releases} columns={columns} size="middle"
                rowKey={rowKey}/>
          </Modal>
          <Row>
            <Col span={24}>
              <div className="albumsTitle">
                Albums
              </div>
              {albums}
            </Col>
          </Row>
      </div>
    );
  }
}

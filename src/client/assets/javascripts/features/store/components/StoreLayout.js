import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import {Row, Col, Input, Tooltip} from 'antd';
import 'antd/dist/antd.css';

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
    const { search, actions } = this.props;
    return () => {
      actions.findReleases(el);
    }
  }
  componentDidMount() {
    const { search, actions } = this.props;
  }
  scoreDetailsDOM(r) {
    let scores = r.score.details.map((d) => (

      <Row>
        <Col span={18}>{d.desc}</Col>
        <Col span={6}>{d.amount}</Col>
      </Row>
    ))
    return (
        <div>{scores}</div>
    )
  }
  render() {
    const { store, actions } = this.props;
    const boundSearchStringChange = this.searchStringChange.bind(this);
    const boundSearch = this.search.bind(this);
    const albums = store.results.albums.map((a) =>
    <Row gutter={24} key={a.id} onClick={this.makeSelectItem(a.id)} >
      <Col span={8} className="albumSelect">{a.album}</Col>
      <Col span={8} className="albumSelect">{a.artist}</Col>
    </Row>)
    const releases = store.releases.map((r) =>
    <Row gutter={24} key={r.id} >
      <Col span={6} className="releaseSelect">{r.album}</Col>
      <Col span={6} className="releaseSelect">{r.artist}</Col>
      <Col span={3} className="releaseSelect">{r.format}</Col>
      <Col span={5} className="releaseSelect">{r.encoding}</Col>
      <Col span={2} className="releaseSelect">{r.seeders}</Col>
      <Col span={2} className="releaseSelect">
        <Tooltip title={this.scoreDetailsDOM(r)}>
          <span>{r.score.total}</span>
        </Tooltip>
      </Col>
    </Row>)

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
            <Col span={8}></Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className="albumsTitle">
                Albums
              </div>
              {albums}
            </Col>
            <Col span={12}>
              <div className="releases">
              {releases}
              </div>
            </Col>
          </Row>
      </div>
    );
  }
}

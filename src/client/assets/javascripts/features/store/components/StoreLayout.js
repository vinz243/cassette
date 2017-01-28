import React, { Component, PropTypes } from 'react';
// import ListView from './ListView';
import './StoreApp.scss';
import {Row, Col, Input} from 'antd';
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
  componentDidMount() {
    const { search, actions } = this.props;
  }
  render() {
    const { store, actions } = this.props;
    const boundSearchStringChange = this.searchStringChange.bind(this);
    const boundSearch = this.search.bind(this);
    const albums = store.results.albums.map((a) => <Row gutter={24}>
      <Col span={8}>{a.album}</Col><Col span={8}>{a.artist}</Col></Row>)
    return (
    	<div className="storeContainer" >
        <Row>
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
        <div className="albumsTitle">
          Albums
        </div>
        {albums}
        <div className="tracksTitle">
        </div>
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';

// import './ToolbarApp.scss';
import {Button, Row, Col, Slider, Input} from 'antd';
import 'antd/dist/antd.css';
import './BrowserControls.scss';
import IonGrid from 'react-icons/lib/io/grid';
import IonLogout from 'react-icons/lib/io/log-out';
import IonNavicon from 'react-icons/lib/io/navicon';
import GoListUnordered from 'react-icons/lib/go/list-unordered';

export default class BrowserControls extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired
  };

  render() {
    const { toolbar, actions } = this.props;

    return (
    	<Row gutter={8} className="browserControls">
        <Col span={2} className="listView viewType">
          <IonNavicon />
        </Col>
        <Col span={2} className="hybridView viewType">
          <GoListUnordered />
        </Col>
        <Col span={2} className="gridView viewType selectedViewType">
          <IonGrid />
        </Col>
        <Col span={10} className="searchCol">
          <Input.Search placeholder="Search..." />
        </Col>
        <Col span={1}></Col>
        <Col span={2} className="logoutIcon">
          <IonLogout />
        </Col>
	    </Row>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Row, Col} from 'antd';

import ToolbarView from 'features/toolbar/components/ToolbarView';
import LibraryView from 'features/library/components/LibraryView';
import SidebarView from 'features/sidebar/components/SidebarView';

export default class AppView extends Component {
  render() {
    return (
      <div>
        <ToolbarView {...this.props} />
        <Row gutter={32}>
          <Col span={4}>
            <SidebarView {...this.props} />
          </Col>
          <Col span={16}>
            {this.props.children}
          </Col>
        </Row>
      </div>
    );
  }
}

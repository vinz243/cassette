import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Row, Col, Modal} from 'antd';

import ToolbarView from 'features/toolbar/components/ToolbarView';
import LibraryView from 'features/library/components/LibraryView';
import SidebarView from 'features/sidebar/components/SidebarView';
import UpdaterView from 'features/updater/components/UpdaterView';
import JobsView from 'features/jobs/components/JobsView';
import axios from 'axios';


export default class AppView extends Component {
  componentDidMount() {
    // let canCancel = true;
    // let showError = () => setTimeout(() => {
    //   Modal.error({
    //     title: 'Ooops, something went wrong...',
    //     content: 'Could not update cassette to latest version. You should probably check the logs or try manually.'
    //   })
    // }, 250);
    // axios.get('/v1/updates').then((res) => {
    //   if (res.data.data.length !== 0) {
    //     Modal.confirm({
    //       title: 'A new update is available',
    //       content: 'A new version is available. You can choose to update now.'
    //        + '\nThis is will update it automatically without you taking any further action.',
    //       onOk() {
    //         canCancel = false;
    //
    //       },
    //       okText: 'Update Now',
    //       cancelText: 'Maybe later',
    //       onCancel(e) {
    //         return canCancel ? Promise.resolve() : null;
    //       },
    //     });
    //   }
    // });
  }
  render() {
    return (
      <div>
        <ToolbarView {...this.props} />
        <Row>
          <Col span={4}>
            <SidebarView {...this.props} />
            <JobsView />
          </Col>
          <Col span={16}>
            {this.props.children}
          </Col>
          <UpdaterView {...this.props} />
        </Row>
      </div>
    );
  }
}

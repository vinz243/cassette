import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ToolbarView from 'features/toolbar/components/ToolbarView';
import LibraryView from 'features/library/components/LibraryView';
import SidebarView from 'features/sidebar/components/SidebarView';
import UpdaterView from 'features/updater/components/UpdaterView';
import JobsView from 'features/jobs/components/JobsView';

import axios from 'axios';
import { Flex, Box } from 'reflexbox';

export default class AppView extends Component {
  render() {
    return (
      <div className="rootContainer">
        <div className="toolbarContainer" style={{
          'box-shadow': '0px 0px 12px 0px rgba(0,0,0,0.75)',
          'position': 'fixed',
          'width': '100%',
          'zIndex': 999
        }}>
          <ToolbarView {...this.props} />
        </div>
        <div className="bodyContainer" style={{
            'padding-top': '64px'
          }}>
          <Flex>
            <Box col={2}>
            {/*  <SidebarView {...this.props} />*/}
            </Box>
            <Box col={8}>
              {this.props.children}
            </Box>
          </Flex>
          <UpdaterView {...this.props} />
        </div>
      </div>
    );
  }
}

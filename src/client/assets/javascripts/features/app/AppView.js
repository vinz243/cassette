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
      <div className="rootContainer" style={{
        }}>
        <div className="toolbarContainer" style={{
          'box-shadow': '0px 0px 12px 0px rgba(0,0,0,0.75)',
          'width': '100%',
          'zIndex': 999,
          'position': 'fixed',
        }}>
          <ToolbarView {...this.props} />
        </div>
        <div className="bodyContainer" style={{
            'padding-top': '64px'
          }}>
          <Flex align="center" justify="space-between">
            <Box style={{
                'zIndex': 998,
                'position': 'fixed',
                'box-shadow': '0px 0px 18px 0px rgba(0,0,0,0.75)',
                'background-color': 'rgb(45, 45, 46)',
                'top': '64px',
                'bottom': '0px'
              }} >
              <SidebarView {...this.props} />
            </Box>
            <Box auto style={{
                'margin-left': '90px'
              }}>
              {this.props.children}
            </Box>
          </Flex>
          <UpdaterView {...this.props} />
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ToolbarView from 'features/toolbar/components/ToolbarView';
import LibraryView from 'features/library/components/LibraryView';
import SidebarView from 'features/sidebar/components/SidebarView';
import UpdaterView from 'features/updater/components/UpdaterView';
import PlaylistView from 'features/playlist/components/PlaylistView';
import JobsView from 'features/jobs/components/JobsView';

import axios from 'axios';
import { Flex, Box } from 'reflexbox';
import {Intent} from '@blueprintjs/core';
import socket from 'app/socket';
import toaster from 'app/toaster';
import notifications from './notifications';

export default class AppView extends Component {
  componentDidMount() {
    notifications();
  }
  render() {
    return (
      <div className="rootContainer" style={{
        }}>
        <div className="toolbarContainer" style={{
          boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.75)',
          width: '100%',
          zIndex: 39,
          position: 'fixed',
        }}>
          <ToolbarView {...this.props} />
        </div>
        <div className="bodyContainer" style={{
            paddingTop: '64px'
          }}>
          <Flex align="center" justify="space-between">
            <Box style={{
                zIndex: 38,
                position: 'fixed',
                boxShadow: '0px 0px 18px 0px rgba(0,0,0,0.75)',
                backgroundColor: 'rgb(45, 45, 52)',
                top: '64px',
                bottom: '0px'
              }} >
              <SidebarView {...this.props} />
            </Box>
            <Box auto style={{
                marginLeft: '90px',
                marginRight: '300px'
              }}>
              {this.props.children}
            </Box>
            <Box style={{
                zIndex: 998,
                position: 'fixed',
                right: '0',
                boxShadow: '0px 0px 18px 0px rgba(0,0,0,0.75)',
                backgroundColor: 'rgb(45, 45, 46)',
                top: '64px',
                bottom: '0px',
                width: '275px'
              }}>
              <PlaylistView {...this.props} />
            </Box>
          </Flex>
          <UpdaterView {...this.props} />
        </div>
      </div>
    );
  }
}

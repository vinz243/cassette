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
        <div className="toolbarContainer">
          <ToolbarView {...this.props} />
        </div>
        <div className="bodyContainer">
          <Flex>
            <Box col={2}>
              <SidebarView {...this.props} />
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as sidebarActions, selector } from '../';
import SidebarLayout from './SidebarLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(sidebarActions, dispatch)
}))
export default class SidebarView extends Component {
  render() {
    return (
      <div>
        <SidebarLayout {...this.props} />
      </div>
    );
  }
}

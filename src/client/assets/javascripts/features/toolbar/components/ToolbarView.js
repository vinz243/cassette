import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as toolbarActions, selector } from '../';
import ToolbarLayout from './ToolbarLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(toolbarActions, dispatch)
}))
export default class ToolbarView extends Component {
  render() {
    return (
      <div>
        <ToolbarLayout {...this.props} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as updaterActions, selector } from '../';
import { createStructuredSelector } from 'reselect';
import UpdaterLayout from './UpdaterLayout';

@connect(createStructuredSelector({
  updater: (state) => state['updater']
}), (dispatch) => {
  let res = {
    actions: bindActionCreators(updaterActions, dispatch)
  };
  return res;
})
export default class UpdaterView extends Component {
  render() {
    return (
      <div>
        <UpdaterLayout {...this.props} />
      </div>
    );
  }
}

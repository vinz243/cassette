import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as jobsActions, selector } from '../';
import { createStructuredSelector } from 'reselect';
import JobsLayout from './JobsLayout';

@connect(createStructuredSelector({
  jobs: (state) => state['jobs']
}), (dispatch) => {
  let res = {
    actions: bindActionCreators(jobsActions, dispatch)
  };
  return res;
})
export default class JobsView extends Component {
  render() {
    return (
      <div>
        <JobsLayout {...this.props} />
      </div>
    );
  }
}

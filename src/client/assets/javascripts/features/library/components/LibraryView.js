import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as libraryActions, selector } from '../';

import LibraryLayout from './LibraryLayout';
@connect(selector, (dispatch) => {
  console.log(libraryActions, dispatch);
  let res = {
    actions: bindActionCreators(libraryActions, dispatch)
  };

  return res;
})
export default class LibraryView extends Component {
  render() {
    return (
      <div>
        <LibraryLayout {...this.props} />
      </div>
    );
  }
}

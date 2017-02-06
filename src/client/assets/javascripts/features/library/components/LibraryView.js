import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as libraryActions, selector } from '../';
import { createStructuredSelector } from 'reselect';

import LibraryLayout from './ArtistsView';

@connect(createStructuredSelector({
  library: (state) => state['library'],
  toolbar: (state) => state['toolbar']
}), (dispatch) => {
  let res = {
    actions: bindActionCreators(libraryActions, dispatch)
  };
  return res;
})
export default class LibraryView extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <LibraryLayout {...this.props} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as storeActions, selector } from '../';

import StoreLayout from './StoreLayout';
import './StoreView.scss';
@connect(selector, (dispatch) => {
  let res = {
    actions: bindActionCreators(storeActions, dispatch)
  };

  return res;
})
export default class LibraryView extends Component {
  render() {
    return (
      <div>
        <StoreLayout {...this.props} />
      </div>
    );
  }
}

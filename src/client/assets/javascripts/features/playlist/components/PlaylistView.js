import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as playlistActions, selector } from '../';
import PlaylistLayout from './PlaylistLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(playlistActions, dispatch)
}))
export default class PlaylistView extends Component {
  render() {
    return (
      <div>
        <PlaylistLayout {...this.props} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as libraryActions, selector } from '../';
import { actionCreators as playlistActions,
  selector as plSelector } from 'features/playlist';
import { createStructuredSelector } from 'reselect';
import UnconnectedArtistsView from './ArtistsView';
import UnconnectedAlbumsView from './AlbumsView';
import LibraryLayout from './LibraryLayout';

const boundConnect = connect.bind(null, createStructuredSelector({
  library: (state) => state['library'],
  toolbar: (state) => state['toolbar'],
  playlist: (state) => state['playlist']
}), (dispatch) => {
  let res = {
    actions: bindActionCreators(
      Object.assign({}, libraryActions, playlistActions),
      dispatch)
  };
  return res;
});

@boundConnect()
export default class LibraryView extends Component {
  render() {
    return (
      <div>
        <LibraryLayout {...this.props} />
      </div>
    );
  }
}

export const ArtistsView = boundConnect()(UnconnectedArtistsView);
export const AlbumsView = boundConnect()(UnconnectedAlbumsView);

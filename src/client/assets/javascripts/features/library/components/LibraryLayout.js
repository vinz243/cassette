import React, { Component, PropTypes } from 'react';
import ListView from './ListView';
import AlbumStreamView from './AlbumStreamView';
import './LibraryApp.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import ViewScope from './ViewScope';
import assert from 'assert';
import merge from 'lodash/merge';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent({scope: 'TRACKS'});

  }
  render() {
    const { library, actions, params } = this.props;
    let content;
    if (library.loading) {
      content = <span>Loading...</span>
    } else {
      let albums = library.items.tracks.reduce((acc, item) => {
        return Object.assign({}, acc, {
          [item.album._id]: Object.assign({}, item.album, {
            tracks: ((acc[item.album._id] || {}).tracks || []).concat(
              Object.assign({}, item, {
                playing:  (this.props.toolbar.currentTrack || {})._id === item._id
              }))
          }, {
            artist: item.artist
          })
        });
      }, {});
      content = Object.values(albums).map(a =>
        <AlbumStreamView key={a._id} album={a} paused={!this.props.toolbar.playing}
          playTracks={actions.playTracks} />);
      // content = <ListView {...this.props}/>
    }
    return (
      <div className="albumsView">
        {content}
      </div>
    );
  }
}

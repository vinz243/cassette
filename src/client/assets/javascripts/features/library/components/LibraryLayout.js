import React, { Component, PropTypes } from 'react';
import AlbumStreamView from './AlbumStreamView';
import './LibraryApp.scss';
import LoaderProxy from './LoaderProxy';
export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent({scope: 'TRACKS', album: this.props.params.albumId});

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
      <LoaderProxy {...this.props}>
        <div className="albumsView">
          {content}
        </div>
      </LoaderProxy>
    );
  }
}

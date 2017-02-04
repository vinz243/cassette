import React, { Component, PropTypes } from 'react';
import ListView from './ListView';
import AlbumStreamView from './AlbumStreamView';
import './LibraryApp.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import assert from 'assert';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent();

  }
  render() {
    const { library, actions } = this.props;
    // {
    //    "id":"aQU74XNiCv3QedVW",
    //    "name":"MRAZ ",
    //    "duration":294060.408,
    //    "artist":{
    //       "id":"7UjxpvBRNstzbVz2",
    //       "name":"Flatbush ZOMBiES"
    //    },
    //    "album":{
    //       "id":"ljSlVUQCk13tFCtN",
    //       "name":"BetterOffDEAD"
    //    }
    // }
    let content;
    if (library.loading) {
      content = <span>Loading...</span>
    } else {
      let albums = library.items
        // .sort((a, b) => (a.number || 0) - (b.number || 0))
        .reduce((acc, val) => {
          let getPlayData = () => {
            let artist = {
              id: val.artist.id,
              name: val.artist.name
            }
            return {
              id: val.id,
              name: val.name,
              originalName: val.originalName,
              duration: val.duration,
              artist: Object.assign({}, artist),
              album: {
                id: val.album.id,
                name: val.album.name,
                artist: Object.assign({}, artist)
              }
            };
          };
          let oldValue = (acc[val.album.id] || {}).tracks || [];
          let res = {
            id: val.album.id,
            name: val.album.name,
            artist: Object.assign({}, val.artist),
            tracks: [].concat({
              name: val.name,
              originalName: val.originalName,
              duration: val.duration,
              number: val.number,
              id: val.id,
              playing: (this.props.toolbar.currentTrack || {}).id === val.id,
              getPlayData,
              play: () => {
                actions.playTracks([getPlayData()].concat(oldValue.map(
                  (track) => track.getPlayData()
                )))
              }
            }, oldValue)
          };
          acc[val.album.id] = res;
          return acc;
      }, {});
      content = Object.values(albums).map(a => <AlbumStreamView key={a.id} album={a} />);
      // content = <ListView {...this.props}/>
    }
    return (
    	<div className="libraryContainer">
        {content}
      </div>
    );
  }
}

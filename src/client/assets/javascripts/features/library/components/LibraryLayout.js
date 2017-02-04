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
      let albums = library.items.reduce((acc, val) => {
        let res = {
          id: val.album.id,
          name: val.album.name,
          artist: Object.assign({}, val.artist),
          tracks: [].concat({
            name: val.name,
            originalName: val.originalName,
            duration: val.duration,
            id: val.id,
            play: () => {
              let artist = {
                id: val.artist.id,
                name: val.artist.name
              }
              actions.playTracks([{
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
              }])
            }
          }, ((acc[val.album.id] || {}).tracks || []))
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

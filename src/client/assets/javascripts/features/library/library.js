
import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';
import uniq from 'lodash/uniq';
import axios from 'axios';
import deepAssign from 'deep-assign';

import {State} from 'models/library';

const SET_VIEW_TYPE     = 'cassette/library/SET_VIEW_TYPE';
const SET_VIEW_SCOPE    = 'cassette/library/SET_VIEW_SCOPE';
const SELECT            = 'cassette/library/SELECT';
const OPEN_SELECTION    = 'cassette/library/OPEN_SELECTION';
const LOAD_CONTENT      = 'cassette/library/LOAD_CONTENT';
const PUSH_CONTENT      = 'cassette/library/PUSH_CONTENT';
const PLAY_TRACKS       = 'cassette/shared/PLAY_TRACKS';

export const NAME = 'library';

const initialState: State = {
  items: [ ],
  loading: true,
  viewType: 'LIST',
  viewScope: 'TRACKS'
};

export default function reducer(state: State = initialState, action: any = {}): State {
  let newState = deepAssign({}, state);
  switch (action.type) {
    case SET_VIEW_TYPE:
      return state;
    case SET_VIEW_SCOPE:
      return state;
    case SELECT:
      return state;
    case OPEN_SELECTION:
      return state;
    case LOAD_CONTENT:
      switch (state.viewScope) {
        case 'TRACKS':
          newState.loading = false;
          newState.items = action.data.map((track) => {
              return deepAssign({}, {
                id: track._id,
                name: track.name.replace(/\(.+\)$/, ''),
                originalName: track.name,
                number: track.trackNumber,
                duration: track.duration * 1000,
                artist: {
                  id: track.artistId,
                  name: track.artist.name
                },
                album: {
                  id: track.albumId,
                  name: track.album.name.replace(/\(.+\).*$/, '')
                },
              }
            );
          }).sort((a, b) => (b.number || 0) - (a.number || 0));
          return newState;
      }
      return state;
    default:
      return state;
  }
}

const library = (state) => state[NAME];

export const selector = createStructuredSelector({
  library
});

function setViewType(value) {
  return {
    type: SET_VIEW_TYPE,
    value
  };
}

function setViewScope(value) {
  return {
    type: SET_VIEW_SCOPE,
    value
  };
}

function select(value) {
  return {
    type: SELECT,
    value
  };
}

function openSelection() {
  return {
    type: OPEN_SELECTION
  };
}

function playTracks(tracks) {
  return {
    type: PLAY_TRACKS,
    tracks: tracks
  };
}
// function loadContent() {
//   return {
//     type: LOAD_CONTENT,
//     data: [
//       {"_id":"NVcZ9spiBPSebv57","name":"X","duration":118160,"albumId":"8B7MePC7rhglf7px","artistId":"1MUjmFoDBQOk2vbO","artist":{"_id":"1MUjmFoDBQOk2vbO","name":"System of a Down"},"album":{"_id":"8B7MePC7rhglf7px","name":"Toxicity","artistId":"1MUjmFoDBQOk2vbO"}}
//     ]
//   }
// }
function loadContent() {

  let doneIds = [];
  let identifiers = {};
  return axios.get('/v1/tracks').then((res) => {
    let data = res.data.data;
    let albums = uniq(data.map((t) => t.albumId)).map((id) => {
      return axios.get(`/v1/albums/${id}`).then((res) => {
        identifiers[id] = res.data.data;
      })
    });

    let artists = uniq(data.map((t) => t.artistId)).map((id) => {
      return axios.get(`/v1/artists/${id}`).then((res) => {
        identifiers[id] = res.data.data;
      });
    })

    return Promise.all([...albums, ...artists]).then(() => {


      return {
        type: LOAD_CONTENT,
        data: data.map((track) => {
          return Object.assign({}, track, {
            artist: identifiers[track.artistId],
            album: identifiers[track.albumId],
            duration: track.duration || 0
          }
        )}).sort((a, b) => a.album.name.localeCompare(b.album.name))
      };
    });
  })
}

function pushContent(data) {
  return {
    type: PUSH_CONTENT,
    data
  };
}

export const actionCreators = {
  setViewType, setViewScope, select, openSelection, loadContent, pushContent, playTracks
}


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
  items:  {
    artists: [],
    albums: [],
    tracks: []
  },
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
          newState.items = Object.assign({}, newState.items, action.data);
          // newState.items.artist = newState.items.artists..map((track) => {
          //     return deepAssign({}, {
          //       id: track._id,
          //       name: track.name.replace(/\(.+\)$/, ''),
          //       originalName: track.name,
          //       number: track.trackNumber,
          //       duration: track.duration * 1000,
          //       artist: {
          //         id: track.artistId,
          //         name: track.artist.name
          //       },
          //       album: {
          //         id: track.albumId,
          //         name: track.album.name.replace(/\(.+\).*$/, '')
          //       },
          //     }
          //   );
          // }).sort((a, b) => (b.number || 0) - (a.number || 0));
          return newState;
      }
      return state;
    case '@@router/LOCATION_CHANGE':
      return Object.assign({}, state, {
        loading: true
      });
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
function loadContent(opts) {
  switch (opts.scope) {
    case 'ARTISTS':
      return axios.get(`/api/v2/artists?sort=name`).then((res) => {
        return {
          type: LOAD_CONTENT,
          data: {
            artists: res.data
          }
        }
      });
    case 'ALBUMS':
      return axios.get(`/api/v2${opts.artist ?
        '/artists/' + opts.artist : ''}/albums?sort=artist`).then((res) => {
        return {
          type: LOAD_CONTENT,
          data: {
            albums: res.data
          }
        }
      });
    case 'TRACKS':
      return axios.get(`/api/v2${
        opts.album ? '/albums/' + opts.album : ''
      }/tracks?sort=trackNumber`).then((res) => {
        return {
          type: LOAD_CONTENT,
          data: {
            tracks: res.data
          }
        }
      });
  }
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


import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';
import uniq from 'lodash/uniq';
import axios from 'app/axios';
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
      return {...state, items: {...state.items, ...action.data}, loading: false};
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
  console.log('loadContent', opts);
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

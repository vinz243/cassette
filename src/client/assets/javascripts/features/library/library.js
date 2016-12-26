
import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';
import axios from 'axios';

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
  items: [],
  loading: true,
  viewType: 'LIST',
  viewScope: 'TRACKS'
};

export default function reducer(state: State = initialState, action: any = {}): State {
  let newState = {};
  assign(newState, state);
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
              console.log(track.duration);
              return {
                id: track._id,
                track: {
                  id: track._id,
                  name: track.name,
                  duration: track.duration,
                  artist: {
                    id: track.artistId,
                    name: track.artist.name
                  },
                  album: {
                    id: track.albumId,
                    name: track.album.name
                  },
                }
              };
          });
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

function loadContent() {

  let doneIds = [];
  let identifiers = {};
  return axios.get('/v1/tracks').then((res) => {
    let data = res.data.data;
    let promises = [];

    for (let track of data) {
      if (!doneIds.includes(track.albumId)) {
        promises.push(axios.get(`/v1/albums/${track.albumId}`).then((res) => {
          identifiers[track.albumId] = res.data.data;
        }));
        doneIds.push(track.albumId);
      }
      if (!doneIds.includes(track.artistId)) {
        promises.push(axios.get(`/v1/artists/${track.artistId}`).then((res) => {
          identifiers[track.artistId] = res.data.data;
        }));
        doneIds.push(track.artistId);
      }
    }
    return Promise.all(promises).then(() => {

      for (let track of data) {
        track.artist = identifiers[track.artistId];
        track.album = identifiers[track.albumId];
        track.duration *= 1000;
      }
      data.sort((a, b) => a.album.name.localeCompare(b.album.name));
      return {
        type: LOAD_CONTENT,
        data
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

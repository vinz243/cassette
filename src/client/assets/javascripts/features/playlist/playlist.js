import {createStructuredSelector} from 'reselect';
import assert from 'assert';
import axios from 'app/axios';
import shortid from 'shortid';

const SET_TRACKS      = 'cassette/playlist/SET_TRACKS';
const ADD_NEXT        = 'cassette/playlist/ADD_NEXT';
const NEXT_TRACK      = 'cassette/playlist/NEXT_TRACK';
const PREVIOUS_TRACK  = 'cassette/playlist/PREVIOUS_TRACK';
const CLEAR           = 'cassette/playlist/SET_PLAYLIST';
const JUMP_TO         = 'cassette/playlist/JUMP_TO';
const MOVE            = 'cassette/playlist/MOVE';
const REMOVE          = 'cassette/playlist/REMOVE';
const SET_TRANSCODE   = 'cassette/playlist/SET_TRANSCODE';
const SET_TOKEN       = 'cassette/playlist/SET_TOKEN';
const TOGGLE_LOSSLESS = 'cassette/playlist/TOGGLE_LOSSLESS';

export const NAME = 'playlist';

const initialState = {
  nextStack: [],
  prevStack: [],
  current: {
    name: 'Nothing playing',
    artist: {
      name: 'Please select a track'
    },
    album: {
      name: 'To listen it'
    }
  },
  transcodes: {},
  tokens: {},
  directPlayback: !!localStorage.getItem('config.playback.direct')
}
export default function reducer (state = initialState, action) {
  switch(action.type) {
    case SET_TOKEN:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.track]: action.token
        }
      }
    case TOGGLE_LOSSLESS:
      localStorage.setItem('config.playback.direct', !state.directPlayback);
      return {
        ...state,
        directPlayback: !state.directPlayback
      }
    case SET_TRANSCODE:
      return {
        ...state,
        transcodes: {
          ...state.transcodes,
          [action.track]: action.transcode
        }
      };
    case SET_TRACKS:
      return Object.assign({}, state, {
        nextStack: action.tracks.slice(1),
        current: action.tracks[0]
      });
    case ADD_NEXT:
      return Object.assign({}, state, {
        nextStack: [action.track, ...state.nextStack]
      });
    case NEXT_TRACK:
      return Object.assign({}, state, {
        nextStack: [...state.nextStack.slice(1)],
        prevStack: [state.current, ...state.prevStack],
        current: state.nextStack[0]
      });
    case PREVIOUS_TRACK:
      return Object.assign({}, state, {
        current: state.prevStack[0],
        nextStack: [state.current, ...state.nextStack],
        prevStack: [...state.prevStack.slice(1)]
      });
    case CLEAR:
      return Object.assign(state, {
        prevStack: [],
        nextStack: []
      });
    case JUMP_TO:
      if (action.index >= 0) {
        return Object.assign({}, state, {
          nextStack: [...state.nextStack.slice(action.index + 1)],
          prevStack: [state.current, ...state.prevStack],
          current: state.nextStack[action.index]
        });
      }
      return state;
    case MOVE:
      assert(action.from >= 0);
      assert(action.from <= state.nextStack.length);
      assert(action.to >= 0);
      assert(action.to <= state.nextStack.length);

      if (action.from === action.to) {
        return state;
      }

      if (action.from < action.to) {
        return Object.assign({}, state, {
          nextStack: [
            ...state.nextStack.slice(0, action.from),
            ...state.nextStack.slice(action.from + 1, action.to + 1),
            ...state.nextStack.slice(action.from, action.from + 1),
            ...state.nextStack.slice(action.to + 1)
          ]
        });
      } else if (action.from > action.to){
        return Object.assign({}, state, {
          nextStack: [
            ...state.nextStack.slice(0, action.to),
            ...state.nextStack.slice(action.from, action.from + 1),
            ...state.nextStack.slice(action.to, action.from),
            ...state.nextStack.slice(action.from + 1)
          ]
        });
      }
    case REMOVE:
      return Object.assign({}, state, {
        nextStack: [
          ...state.nextStack.slice(0, action.index),
          ...state.nextStack.slice(action.index + 1)
        ]
      });
    default:
      return state;
  }
}

const playlist = (state) => state[NAME];

export const selector = createStructuredSelector({
  playlist
});

function toggleLosslessPlayback () {
  return (dispatch, getState) => {
    dispatch({type: TOGGLE_LOSSLESS});
    const playlist = getState().playlist;
    if (playlist.current._id) {
      // loadTranscodesAsync([playlist.current, ...playlist.nextStack], true)
      //   (dispatch, getState);
    }
  }
}

function prepareTrack (track) {
  return (dispatch, getState) => {
    if (getState().playlist.directPlayback) {
      return loadToken(track)(dispatch, getState);
    }
    return loadTranscode(track)(dispatch, getState);
  }
}

function loadToken (track) {
  return (dispatch, getState) => {
    if (getState().playlist.tokens[track]) {
      return;
    }
    axios.post(`/api/v2/tracks/${track}/stream`, {}).then(({data}) => {
      dispatch({
        type: SET_TOKEN,
        token: data.stream_token,
        track
      });
    });
  }
}

function loadTranscode (track) {
  return (dispatch, getState) => {
    if (!getState().playlist.directPlayback && getState().playlist.transcodes[track]) {
      return;
    }
    axios.post('/api/v2/transcodes', {
      track, format: getState().playlist.directPlayback ? 'flac': 'mp3'
    }).then(({data}) => {
      dispatch({
        type: SET_TRANSCODE,
        transcode: data,
        track
      });
    });
  }
}
function loadTranscodesAsync (tracks, first) {
  return (dispatch, getState) => {
    if (!tracks.length) return;
    const playlist = getState().playlist;
    const inNext = playlist.nextStack.find(({_id}) => +tracks[0]._id === +_id);
    if (inNext || first) {
      loadTranscode(tracks[0]._id)(dispatch, getState);
    }
    setTimeout(() =>
      loadTranscodesAsync(tracks.slice(1))(dispatch, getState), 10000);
  }
}

function setTracks (tracks) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TRACKS,
      tracks: tracks.map((track) => Object.assign({}, track, {
        uid: shortid.generate()
      }))
    });
    loadTranscodesAsync(tracks, true)(dispatch, getState);
  }
}

function addAsNext (track) {
  const uid = shortid.generate();
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEXT,
      track: Object.assign({}, track, {uid})
    });
    loadTranscode(track._id)(dispatch, getState);
  }
}

function playNextTrack () {
  return {
    type: NEXT_TRACK
  }
}

function playPreviousTrack () {
  return  {
    type: PREVIOUS_TRACK
  }
}

function clear () {
  return  {
    type: CLEAR
  }
}

function jumpTo (index) {
  return (dispatch, getState) => {
    dispatch({
      type: JUMP_TO,
      index
    });
    const playlist = getState().playlist;
    loadTranscodesAsync([playlist.current, ...playlist.nextStack], true)
      (dispatch, getState);
  }
}

function move (from, to) {
  return {
    type: MOVE,
    from, to
  }
}

function remove (index) {
  return {
    type: REMOVE,
    index
  }
}

export const actionCreators = {
  setTracks,
  addAsNext,
  playNextTrack,
  playPreviousTrack,
  clear,
  jumpTo,
  move,
  remove,
  prepareTrack,
  toggleLosslessPlayback
}

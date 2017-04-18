import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'app/axios';

const ADD_TRACKER         = 'cassette/settings/ADD_TRACKER';
const ADD_LIBRARY         = 'cassette/settings/ADD_LIBRARY';
const PREPARE_ADD_LIBRARY = 'cassette/settings/PREPARE_ADD_LIBRARY';
const EDIT_TRACKER        = 'cassette/settings/EDIT_TRACKER';
const SET_TRACKERS        = 'cassette/settings/SET_TRACKERS';
const SET_LIBRARIES       = 'cassette/settings/SET_LIBRARIES';

const initialState = {
  trackers: [],
  addingLib: false,
  libraries: []
}

export const NAME = 'settings';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TRACKER:
      return Object.assign({}, state, {
        trackers: [...state.trackers, action.tracker]
      });
    case SET_TRACKERS:
      return Object.assign({}, state, {
        trackers: action.trackers
      });
    case EDIT_TRACKER:
      return Object.assign({}, state, {
        trackers: [
          ...state.trackers.slice(0, action.index),
          Object.assign({}, state.trackers[action.index], action.props),
          ...state.trackers.slice(action.index + 1)
        ]
      });
    case PREPARE_ADD_LIBRARY:
      return {...state, addingLib: true};
    case ADD_LIBRARY:
      return Object.assign({}, state, {
        addingLib: false,
        libraries: [...state.libraries, action.library]
      })
    case SET_LIBRARIES:
      return Object.assign({}, state, {
        addingLib: false,
        libraries: action.libraries
      })
  }
  return state;
}

const settings = (state) => state[NAME];

export const selector = createStructuredSelector({
  settings
});
function loadTrackers (id, props) {
  return (dispatch) => {
    axios.get('/api/v2/trackers').then((res) => {
      dispatch({
        type: SET_TRACKERS,
        trackers: res.data
      });
    });
  }
}

function addLibrary (name, path) {
  return (dispatch, getState) => {
    dispatch({type: PREPARE_ADD_LIBRARY});
    axios.post('/api/v2/libraries', {name, path}).then(({data}) => {
      dispatch({type: ADD_LIBRARY, library: data});
    });
  }
}
function loadLibraries () {
  return (dispatch, getState) => {
    dispatch({type: PREPARE_ADD_LIBRARY});
    axios.get('/api/v2/libraries').then(({data}) => {
      dispatch({type: SET_LIBRARIES, libraries: data});
    });
  }
}

function editTracker (id, props) {
  return (dispatch, getState) => {
    dispatch({
      type: EDIT_TRACKER,
      index: getState().settings.trackers.findIndex(el => el._id === id),
      props:  {
        ...props,
        status: 'UPDATING'
      }
    });
    axios.put(`/api/v2/trackers/${id}`, props).then(() => {
      dispatch({
        type: EDIT_TRACKER,
        index: getState().settings.trackers.findIndex(el => el._id === id),
        props:  {
          status: 'UNCONFIRMED'
        }
      });
      return axios.get(`/api/v2/trackers/${id}/status`);
    }).then(({data}) => {
      dispatch({
        type: EDIT_TRACKER,
        index: getState().settings.trackers.findIndex(el => el._id === id),
        props:  data
      });
    })
  }
}
function addTracker () {
  return (dispatch) => {
    axios.post('/api/v2/trackers', {name: 'New Tracker', status: 'UNCONFIRMED'}).then((res) => {
      dispatch({
        type: ADD_TRACKER,
        tracker: res.data
      });
    });
  }
}
export const actionCreators = {
  addTracker, editTracker, loadTrackers, addLibrary, loadLibraries
}

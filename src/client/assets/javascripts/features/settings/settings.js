import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'axios';

const ADD_TRACKER = 'cassette/settings/ADD_TRACKER';
const EDIT_TRACKER = 'cassette/settings/EDIT_TRACKER';

const initialState = {
  trackers: []
}

export const NAME = 'settings';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TRACKER:
      return Object.assign({}, state, {
        trackers: [...state.trackers, action.tracker]
      });
    case EDIT_TRACKER:
      return Object.assign({}, state, {
        trackers: [
          ...state.trackers.slice(0, action.index),
          Object.assign({}, state.trackers[action.index], action.props),
          ...state.trackers.slice(action.index + 1)
        ]
      });
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
      res.data.forEach((tracker) => dispatch({
        type: ADD_TRACKER,
        tracker
      }));
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
  addTracker, editTracker, loadTrackers
}

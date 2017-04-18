import { createStructuredSelector } from 'reselect';

import axios from 'app/axios';
import shortid from 'shortid';
export const NAME = 'configuration';

const NEXT_STEP = 'cassette/configuration/NEXT_STEP';
const PREV_STEP = 'cassette/configuration/PREV_STEP';
const UPDATE_CHECKS = 'cassette/configuration/UPDATE_CHECKS';
const START_CONFIGURE = 'cassette/configuration/START_CONFIGURE';

const initialState = {
  checksById: {},
  configuringUser: false,
  libraries: [{
    name: 'Downloads',
    path: '/home/vincent/.cassette/downloads',
    _id: 2,
    synced: true
  }, {
    name: 'Torrents',
    path: '/home/vincent/torrents/music',
    _id: 3,
    synced: false
  }],
  steps: ['checks', 'login', 'libraries', 'trackers'],
  currentStep: 'checks',
  checksProcessing: true,
  userConfigured: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case START_CONFIGURE:
      return {
        ...state, configuringUser: true, userConfigured: true
      }
    case NEXT_STEP:
      return {
        ...state,
        currentStep: state.steps[state.steps.indexOf(state.currentStep) + 1],
        configuringUser: false
      }
    case PREV_STEP:
      const index = state.steps.indexOf(state.currentStep);
      if (!index) return state;
      return {
        ...state,
        currentStep: state.steps[index - 1]
      }
    case UPDATE_CHECKS:
      const {data} = action;
      return {
        ...state,
        checksProcessing: Object.values(data).find(el => el.status === 'uk'),
        checksPassed: Object.values(data).every(el => el.status === 'ok'),
        checksById: data
      }
    default:
      return state;
  }
}

function configureApp(username, password) {
  return function (dispatch, getState) {
    if (getState().configuration.userConfigured) {
      return dispatch(nextStep());
    }
    dispatch({type: START_CONFIGURE});
    axios.post('/api/v2/configure', {username, password}).then(() => {
      return axios.login({username, password});
    }).then(() => {
      return axios.get('/api/v2/versions');
    }).then(({data}) => {
      dispatch(nextStep());
    });
  }
}

function updateChecks () {
  return function (dispatch) {
    const id = shortid.generate();
    function update () {
      axios.get(`/api/v2/checks/${id}`).then(({data}) => {
        dispatch({
          type: UPDATE_CHECKS, data
        });
        if (Object.values(data).find(el => el.status === 'uk')) {
          setTimeout(() => {
            update();
          }, 500)
        }
      });
    }
    update();
  }
}

const configuration = (state) => state[NAME];

export const selector = createStructuredSelector({
  configuration
});

function nextStep () {
  return {
    type: NEXT_STEP
  }
}
function prevStep () {
  return {
    type: PREV_STEP
  }
}

export const actionCreators = {
  nextStep, prevStep, updateChecks, configureApp
}

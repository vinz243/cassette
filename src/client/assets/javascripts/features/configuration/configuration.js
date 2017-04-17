import { createStructuredSelector } from 'reselect';

import axios from 'axios';
export const NAME = 'configuration';

const NEXT_STEP = 'cassette/configuration/NEXT_STEP';
const PREV_STEP = 'cassette/configuration/PREV_STEP';

const initialState = {
  checksById: {
    'ssl': {
      name: 'SSL Check',
      message: 'Server isn\'t using a secure connection (https)',
      status: 'ko'
    },
    'node_version': {
      name: 'Node version check',
      message: 'You are using node v7.7.4 (>= 7.7.0)',
      status: 'ok'
    },
    'rtorrent': {
      name: 'rTorrent status',
      message: 'rTorrent is available through port 36810',
      status: 'ok'
    },
    'disk_writable': {
      name: 'Cassette folder writable',
      message: '.cassette folder is writable in /home/vincent/.cassette',
      status: 'ok'
    },
    'socketio_connected': {
      name: 'WebSocket connected',
      message: 'Trying to connect through websocket',
      status: 'uk'
    }
  },
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
  currentStep: 'checks'
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case NEXT_STEP:
      return {
        ...state,
        currentStep: state.steps[state.steps.indexOf(state.currentStep) + 1]
      }
    case PREV_STEP:
      const index = state.steps.indexOf(state.currentStep);
      if (!index) return state;
      return {
        ...state,
        currentStep: state.steps[index - 1]
      }
    default:
      return state;
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
  nextStep, prevStep
}

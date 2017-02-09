// Feature/Module index is responsible for maintaining its public API
// This is the exposed surface where modules can interface with each other.

import { createStructuredSelector } from 'reselect';

import axios from 'axios';
import deepAssign from 'deep-assign';

const UPDATE = 'cassette/updater/UPDATE';
const PREPARE_UPDATE = 'cassette/updater/PREPARE_UPDATE';
const FETCH = 'cassette/updater/FETCH';
const CANCEL = 'cassette/updater/CANCEL';

export const NAME = 'updater';

const initialState = {
  versions: [],
  latest: '0.0.0',
  current: '0.0.0',
  updateAvailable: false,
  updating: false,
  errored: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CANCEL:
      return Object.assign({}, state, {
        updateAvailable: false,
        errored: false
      });
    case PREPARE_UPDATE:
      return Object.assign({}, state, {
        updating: true
      });
    case UPDATE:
      if (action.errored) {
        return Object.assign({}, state, {
          updating: false,
          errored: action.errored
        });
      }
      setTimeout(() => window.location.reload(), 200);
      return state;
    case FETCH:
      let newProps = {
        versions: action.data,
        latest: action.data.find(v => v.latest).name,
        current: action.data.find(v => v.current).name,
        updateAvailable: !action.data.find(v => v.current).latest,
      };
      return Object.assign({}, state, newProps);
    default:
      return state;
  }
}

const updater = (state) => state[NAME];
const delay = function (time) {
  return (arg) => {
    return new Promise (resolve => setTimeout(resolve.bind(null, arg), time));
  }
}
export const selector = createStructuredSelector({
  updater
});
function prepareUpdate () {
  return {
    type: PREPARE_UPDATE
  }
}
function cancel () {
  return {
    type: CANCEL
  }
}
function fetch() {
  return axios.get('/v1/versions').then((res) => {
    console.log(res.data.data);
    return Promise.resolve({
      type: FETCH,
      data: res.data.data
    });
  });
}
function update() {
  return new Promise((resolve) => {
    axios.post('/v1/update').then((res) => {
      console.log(res);
      return axios.post('/v1/restart').then(delay(3000))
    }).then((res) => {
      resolve({
        type: UPDATE
      });
    }).catch((err) => {
      return resolve({
        type: UPDATE,
        errored: true
      });
    });
  })
}


export const actionCreators = {
  update, fetch, prepareUpdate, cancel
}

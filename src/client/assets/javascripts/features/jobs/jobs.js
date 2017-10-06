// Feature/Module index is responsible for maintaining its public API
// This is the exposed surface where modules can interface with each other.

import { createStructuredSelector } from 'reselect';

import axios from 'app/axios';
import deepAssign from 'deep-assign';

const UPDATE = 'cassette/jobs/UPDATE';

export const NAME = 'jobs';

const initialState = {
  jobs: []
};

export default function reducer(state = initialState, action = {}) {
  let newState = deepAssign({}, state);
  switch (action.type) {
    case UPDATE:
      newState.jobs = action.data;
      return newState;
    default:
      return state;
  }
}

const library = (state) => state[NAME];

export const selector = createStructuredSelector({
  library
});

function update() {

  return axios.get('/v1/jobs').then((res) => {
    let data = res.data.data;
    return {
      type: UPDATE,
      data
    }
  })
}


export const actionCreators = {
  update
}

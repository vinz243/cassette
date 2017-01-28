import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'axios';

const UPDATE_RESULTS = 'cassette/library/SEAUPDATE_RESULTSRCH';

const initialState = {
  query: '',
  results: {
    albums: [],
    tracks: []
  }
}
export const NAME = 'store';
export default function reducer(state = initialState, action = {}) {
  let newState = {};
  assign(newState, state);
  switch (action.type) {
    case UPDATE_RESULTS:
      newState.results.albums = action.data.albums;
      newState.results.tracks = action.data.tracks;
      return newState;
  }
  return state;
}

const store = (state) => state[NAME];

export const selector = createStructuredSelector({
  store
});

function searchAndUpdateResults(query) {
  return axios.post('/v1/store/searches', {
    query: query,
    limit: 5
  }).then((response) => {
    return Promise.resolve({
      type: UPDATE_RESULTS,
      data: response.data.data
    });
  });
}

export const actionCreators = {
  searchAndUpdateResults
}

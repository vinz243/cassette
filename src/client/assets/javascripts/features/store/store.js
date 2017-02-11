import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'axios';

const UPDATE_RESULTS = 'cassette/library/UPDATE_RESULTS';
const UPDATE_RELEASES = 'cassette/library/UPDATE_RELEASES';
const SET_LOSSLESS = 'cassette/library/SET_LOSSLESS';
const HIDE_RELEASES = 'cassette/library/HIDE_RELEASES';


const initialState = {
  query: '',
  results: {
    albums: [],
    tracks: []
  },
  releases: [],
  lossless: false,
  showReleases: false
}
export const NAME = 'store';
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case HIDE_RELEASES:
      return Object.assign({}, state, {
        showReleases: false
      });
    case UPDATE_RESULTS:
      return Object.assign({}, state, {
        results: action.data
      });
    case UPDATE_RELEASES:
      return Object.assign({}, state, {
        showReleases: true,
        releases: action.data
      });
    case SET_LOSSLESS:
      return Object.assign({}, state, {
        lossless: action.flag
      });
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
    limit: 25
  }).then((response) => {
    return Promise.resolve({
      type: UPDATE_RESULTS,
      data: response.data.data
    });
  });
}
function findReleases(id, lossless = false) {
  return axios.get(`/v1/store/${id}/releases?lossless=${lossless - 0}`).then(response => {
    return Promise.resolve({
      type: UPDATE_RELEASES,
      data: response.data.data.sort((a, b) => b.score.total - a.score.total)
    });
  });
}
function hideReleases() {
    return {
      type: HIDE_RELEASES
    }
}
function setLossless(flag) {
  return {
    type: SET_LOSSLESS,
    flag
  }
}
export const actionCreators = {
  searchAndUpdateResults, findReleases, setLossless, hideReleases
}

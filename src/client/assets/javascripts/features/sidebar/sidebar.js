import {createStructuredSelector} from 'reselect';
import assign from 'lodash/assign';
import axios from 'axios';
import {actionCreators as libraryActionCreators} from 'features/library';

const SELECT_LIBRARY = 'cassette/shared/SELECT_LIBRAY';
const ADD_LIBRARY    = 'cassette/sidebar/ADD_LIBRARY';
const REMOVE_LIBRARY = 'cassette/sidebar/REMOVE_LIBRARY';
const EDIT_LIBRARY   = 'cassette/sidebar/EDIT_LIBRARY';
const SCAN_LIBRARY   = 'cassette/sidebar/SCAN_LIBRARY';
const LOAD_CONTENT   = 'cassette/sidebar/LOAD_CONTENT';

export const NAME = 'sidebar';

const initialState = {
  currentSelection: undefined,
  libraries: []
};

export default function reducer(state, action) {
  let newState = {};
  assign(newState, state);


  switch(action.type) {
    case SELECT_LIBRARY:
      return newState;
    case ADD_LIBRARY:
      newState.libraries = newState.libraries || [];
      newState.libraries.push(action.library);
      return newState;
    case REMOVE_LIBRARY:
      return newState;
    case SCAN_LIBRARY:
      return newState;
    case LOAD_CONTENT:
      newState.libraries = action.libraries;
      return newState;
    default:
      return newState;
  }
}

const sidebar = (state) => state[NAME];

export const selector = createStructuredSelector({
  sidebar
});

function selectLibrary(id: string) {
  return {
    type: SELECT_LIBRARY,
    id
  };
}

function addLibrary(name, path) {
  return axios.post('/v1/libraries', {
    name, path
  }).then((res) => {
    let data = res.data.data;
    return Promise.resolve({
      type: ADD_LIBRARY,
      library: data
    })
  });
}

function waitScan(libId, scanId) {
  return new Promise((resolve, reject) => {
    let wait = (res) => {
      if (res.data.data.statusCode === 'DONE')
        return resolve();
      setTimeout(() => {
        axios.get(`/v1/libraries/${libId}/scans/${scanId}`).then(wait);
      }, 700);
    };
    wait({
      data: {
        data: {}
      }
    });
  });
}

function scanLibrary(id: string) {
  return axios.post(`/v1/libraries/${id}/scans`, {}).then((res) => {
    let data = res.data.data;
    return waitScan(id, data._id);
  }).then(() => {
    return libraryActionCreators.loadContent();
  });
}

function loadContent() {
  return axios.get('/v1/libraries').then((res) => Promise.resolve({
    type: LOAD_CONTENT,
    libraries: res.data.data
  }));
}

export const actionCreators = {
  selectLibrary, addLibrary, scanLibrary, loadContent
};

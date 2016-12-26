import {createStructuredSelector} from 'reselect';
import assign from 'lodash/assign';

const SELECT_LIBRARY = 'cassette/shared/SELECT_LIBRAY';
const ADD_LIBRARY    = 'cassette/sidebar/ADD_LIBRARY';
const REMOVE_LIBRARY = 'cassette/sidebar/REMOVE_LIBRARY';
const EDIT_LIBRARY   = 'cassette/sidebar/EDIT_LIBRARY';
const SCAN_LIBRARY   = 'cassette/sidebar/RESCAN_LIBRARY';
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
      return newState;
    case REMOVE_LIBRARY:
      return newState;
    case SCAN_LIBRARY:
      return newState;
    case LOAD_CONTENT:
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
  return {
    type: ADD_LIBRARY,
    path, name
  };
}

function scanLibrary(id: string) {
  return {
    type: SCAN_LIBRARY,
    id
  };
}

function loadContent() {
  return {
    type: LOAD_CONTENT
  };
}

export const actionCreators = {
  selectLibrary, addLibrary, scanLibrary, loadContent
};

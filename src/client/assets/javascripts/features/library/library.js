
import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';

import {State} from 'models/library';

const SET_VIEW_TYPE     = 'cassette/library/SET_VIEW_TYPE';
const SET_VIEW_SCOPE    = 'cassette/library/SET_VIEW_SCOPE';
const SELECT            = 'cassette/library/SELECT';
const OPEN_SELECTION    = 'cassette/library/OPEN_SELECTION';
const LOAD_CONTENT      = 'cassette/library/LOAD_CONTENT';
const PUSH_CONTENT      = 'cassette/library/PUSH_CONTENT';

export const NAME = 'library';

const initialState: State = {
  items: [{
    name: 'Killing in The Name',
    id: '1',
    type: 'TRACK',
  }, {
    name: 'Rap God',
    id: '3',
    type: 'TRACK'
  }],
  viewType: 'LIST',
  viewScope: 'TRACKS'
};

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    case SET_VIEW_TYPE:
      return state;
    case SET_VIEW_SCOPE:
      return state;
    case SELECT:
      return state;
    case OPEN_SELECTION:
      return state;
    case LOAD_CONTENT:
      switch (state.viewScope) {
        case 'TRACKS':
          // fetch('/v1/tracks').then(res => res.json()).then((body) => {
          //   console.log(body);
          // });
      }
      return state;
    default:
      return state;
  }
}

const library = (state) => state[NAME];

export const selector = createStructuredSelector({
  library
});

function setViewType(value) {
  return {
    type: SET_VIEW_TYPE,
    value
  };
}

function setViewScope(value) {
  return {
    type: SET_VIEW_SCOPE,
    value
  };
}

function select(value) {
  return {
    type: SELECT,
    value
  };
}

function openSelection() {
  return {
    type: OPEN_SELECTION
  };
}

function loadContent() {
  return {
    type: LOAD_CONTENT
  };
}

function pushContent(data) {
  return {
    type: PUSH_CONTENT,
    data
  };
}

export const actionCreators = {
  setViewType, setViewScope, select, openSelection, loadContent, pushContent
}

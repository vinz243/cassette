import { createStructuredSelector } from 'reselect';

import axios from 'app/axios';
import socket from 'app/socket';
import shortid from 'shortid';
import path from 'path';

export const NAME = 'configuration';

const NEXT_STEP = 'cassette/configuration/NEXT_STEP';
const PREV_STEP = 'cassette/configuration/PREV_STEP';
const UPDATE_CHECKS = 'cassette/configuration/UPDATE_CHECKS';
const START_CONFIGURE = 'cassette/configuration/START_CONFIGURE';
const LOAD_DIR = 'cassette/configuration/LOAD_DIR';
const SET_CURRENT_PATH = 'cassette/configuration/SET_CURRENT_PATH';
const SET_LIBRARY = 'cassette/configuration/SET_LIBRARY';
const ADD_LIBRARY = 'cassette/configuration/ADD_LIBRARY';

const initialState = {
  checksById: {},
  configuringUser: false,
  libraries: [],
  steps: ['checks', 'login', 'libraries', 'trackers'],
  currentPath: [],
  fs: {},
  currentStep: 'checks',
  checksProcessing: true,
  userConfigured: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_LIBRARY:
      return {...state, libraries: [
        ...state.libraries, action.library
      ]};
    case SET_LIBRARY:
      const id = action.library._id;
      const foundIndex = state.libraries.findIndex((lib) => lib._id === id);
      const i = foundIndex !== -1 ? foundIndex :
        state.libraries.length - 1;
      return {
        ...state, libraries: [
          ...state.libraries.slice(0, i),
          {...state.libraries[i], ...action.props},
          ...state.libraries.slice(i + 1)
        ]
      };
    case SET_CURRENT_PATH:
      return  {
        ...state,
        currentPath: [...action.path, '.']
      };
    case LOAD_DIR:
      return {
        ...state,
        fs: {
          ...state.fs,
          [action.folder]: action.content
        }
      };
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
function loadLibs() {
  return (dispatch) => {
    axios.get('/api/v2/vars').then(({data: {homedir, configRoot}}) => {
      dispatch(setCurrentPath(homedir + '/.'));
      addLibrary('Downloads', path.join(configRoot, 'downloads'))(dispatch);
    });
  }
}

function addLibrary(name, path) {
  return (dispatch) => {
    dispatch({
      type: ADD_LIBRARY,
      library: {name, path}
    });
    axios.post('/api/v2/libraries', {name, path}).then(({data}) => {
      dispatch({
        type: SET_LIBRARY,
        library: data
      });
      return axios.post('/api/v2/scans', {library: data._id}).then((res) => {
        return Promise.resolve([data, res.data]);
      });
    }).then(([library, scan]) => {
      dispatch({
        type: SET_LIBRARY,
        library: {_id: library._id, scan: 'pending'}
      });
      socket.listen(`scanner::scanfinished::${scan._id}`, function () {
        dispatch({
          type: SET_LIBRARY,
          library: {_id: library._id, scan: 'done'}
        });
      });
    })
  }
}

function setCurrentPath(folder = '') {
  if (typeof folder === 'string') {
    return {
      type: SET_CURRENT_PATH,
      path: path.join(folder).split('/').filter(str => str)
    };
  }
  return setCurrentPath('/' + folder.join('/'));
}
async function loadPath(folder) {
  const {data} = await axios.get(`/api/v2/fs${folder}`);
  return {
    content: data, type: LOAD_DIR,
    folder,
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
  nextStep, prevStep, updateChecks, configureApp, loadPath, setCurrentPath,
  loadLibs, addLibrary
}

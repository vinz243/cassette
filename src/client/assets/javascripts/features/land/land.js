import { createStructuredSelector } from 'reselect';
import axios from 'app/axios';
import {push} from 'react-router-redux';


const SET_STATUS = 'cassette/land/SET_STATUS';

export const NAME = 'land';

const initialState = {
  loggedIn: false,
  configured: false,
  loading: true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_STATUS:
      return {...state, loading: false, ...action.status}
    default:
      return state;
  }
}

const land = (state) => state[NAME];

export const selector = createStructuredSelector({
  land
});

function startConfigure () {
  return push('/configure');
}

async function fetchStatus () {
  const {data} = await axios.get('/api/v2/status');
  return {
    type: SET_STATUS,
    status: data
  }
}

export const actionCreators = {
  fetchStatus, startConfigure
}

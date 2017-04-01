import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'axios';

const SET_ARTIST_RESULTS  = 'cassette/store/SET_ARTIST_RESULTS';
const SET_ALBUMS_RESULTS  = 'cassette/store/SET_ALBUMS_RESULTS';
const SET_QUERY           = 'cassette/store/SET_QUERY';


const initialState = {
  currentAlbum: '',
  albumsById: {},
  albumsByArtist: {},
  artistsByQuery: {},
  albumsByQuery: {},
  query: {}
}

export const NAME = 'store';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_QUERY:
      return Object.assign({}, state, {
        query: Object.assign({}, state.query, action.query)
      });
    case SET_ARTIST_RESULTS:
      return Object.assign({}, state, {
        artistsByQuery: Object.assign({}, state.artistsByQuery, action.results)
      });
    case SET_ALBUMS_RESULTS:
      return Object.assign({}, state, {
        albumsByQuery: Object.assign({}, state.albumsByQuery, action.results)
      });
  }
  return state;
}

const store = (state) => state[NAME];

export const selector = createStructuredSelector({
  store
});

function setQuery (query) {
  return {
    type: SET_QUERY,
    query
  }
}

function fetchArtistsResult (query) {
  query = query.toLowerCase();
  const blank = {
    type: SET_ARTIST_RESULTS,
    results: {}
  };
  return function (dispatch, getState) {
    const state = getState().store;
    if (state.query.artists === query) {
      return dispatch(blank);
    }
    dispatch(setQuery({artists: query}));
    if (state.artistsByQuery[query]) {
      return dispatch(blank);
    }
    axios.post('/api/v2/store/artists/searches', {query}).then(({data}) => {
      if (getState().store.artistsByQuery[query]) {
        dispatch(blank);
      } else {
        dispatch({
          type: SET_ARTIST_RESULTS,
          results: {
            [query]: data
          }
        });
      }
    });
  }
}
function fetchAlbumsResult (query) {
  query = query.toLowerCase();
  const blank = {
    type: SET_ALBUMS_RESULTS,
    results: {}
  };
  return function (dispatch, getState) {
    const state = getState().store;
    if (state.query.albums === query) {
      return dispatch(blank);
    }
    dispatch(setQuery({albums: query}));
    if (state.albumsByQuery[query]) {
      return dispatch(blank);
    }
    axios.post('/api/v2/store/release-groups/searches', {query}).then(({data}) => {
      if (getState().store.albumsByQuery[query]) {
        dispatch(blank);
      } else {
        dispatch({
          type: SET_ALBUMS_RESULTS,
          results: {
            [query]: data
          }
        });
      }
    });
  }
}
function fetchArtistAlbums(artist) {
  const blank = {
    type: SET_ALBUMS_RESULTS,
    results: {}
  };
  return function (dispatch, getState) {
    const state = getState().store;
    if (state.query.albums === artist) {
      return dispatch(blank);
    }
    dispatch(setQuery({albums: artist}));
    if (state.albumsByQuery[artist]) {
      return dispatch(blank);
    }
    axios.get(`/api/v2/store/artists/${artist}/release-groups`)
      .then(({data}) => {
        if (getState().store.albumsByQuery[artist]) {
          dispatch(blank);
        } else {
          dispatch({
            type: SET_ALBUMS_RESULTS,
            results: {
              [artist]: data
            }
          });
        }
      });
  }
}

export const actionCreators = {
  fetchArtistsResult, fetchAlbumsResult, fetchArtistAlbums
}

import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'app/axios';

const SET_ARTIST_RESULTS  = 'cassette/store/SET_ARTIST_RESULTS';
const SET_ALBUMS_RESULTS  = 'cassette/store/SET_ALBUMS_RESULTS';
const SET_ALBUM_RESULT    = 'cassette/store/SET_ALBUM_RESULT';
const SET_QUERY           = 'cassette/store/SET_QUERY';
const ADD_ALBUM_FILTER    = 'cassette/store/ADD_ALBUM_FILTER';
const REMOVE_ALBUM_FILTER = 'cassette/store/REMOVE_ALBUM_FILTER';
const FETCH_ALL_WANTED    = 'cassette/store/FETCH_ALL_WANTED';
const FETCH_WANTED        = 'cassette/store/FETCH_WANTED';
const SET_WANTED          = 'cassette/store/SET_WANTED';
const DOWNLOAD_ALBUM      = 'cassette/store/DOWNLOAD_ALBUM';
const INVALIDATE_WANTED   = 'cassette/store/INVALIDATE_WANTED';
const TOGGLE_LOSSLESS     = 'cassette/store/TOGGLE_LOSSLESS';

const initialState = {
  currentAlbum: '',
  albumsById: {},
  artistsByQuery: {},
  albumsByQuery: {},
  query: {},
  albumsFilter: [],
  wanted: [],
  wantedById: {},
  currentWanted: '',
  wantLossless: true
}

export const NAME = 'store';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_LOSSLESS:
      return {...state, wantLossless: !state.wantLossless};
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
    case SET_ALBUM_RESULT:
      return Object.assign({}, state, {
        albumsById: Object.assign({}, state.albumsById, action.results)
      })
    case ADD_ALBUM_FILTER:
      return Object.assign({}, state, {
        albumsFilter: [action.filter, ...state.albumsFilter]
      });
    case REMOVE_ALBUM_FILTER:
      return Object.assign({}, state, {
        albumsFilter: state.albumsFilter.filter(el => el !== action.filter)
      });
    case FETCH_ALL_WANTED:
      return Object.assign({}, state, {
        wanted: action.wanted
      });
    case SET_WANTED:
      return {
        ...state,
        currentWanted: action.currentWanted
      }
    case FETCH_WANTED:
      const index = state.wanted.findIndex(el => el._id === action.wanted._id);
      const wantedById = {
        ...state.wantedById,
        [action.wanted._id]: action.wanted
      };
      if (index) {
        console.log('INDEX FOUND');

        return Object.assign({}, state, {
          wantedById,
          wanted: [
            ...state.wanted.slice(0, index),
            Object.assign({}, action.wanted, {results: undefined}),
            ...state.wanted.slice(index + 1)
          ]
        });
      }
      return Object.assign({}, state, {
        wantedById
      });
  case INVALIDATE_WANTED:
    return Object.assign({}, state, {
      wantedById: {
        ...state.wantedById,
        [action.id]: {
          ...state.wantedById[action.id], stale: true
        }
      }
    });
  }
  return state;
}

const store = (state) => state[NAME];

export const selector = createStructuredSelector({
  store
});
function toggleLossless () {
  return {type: TOGGLE_LOSSLESS};
}
function invalidateWanted (id) {
  return {
    type: INVALIDATE_WANTED, id
  }
}

function onUpdate (newProps, props) {
  return (dispatch, getState) => {
    const {wantedById, currentWanted} = getState().store;
    dispatch({
      type: FETCH_WANTED,
      id: props._id,
      wanted: {...props, results: wantedById[props._id].results}
    });
    if (newProps.status) {
      dispatch({type: INVALIDATE_WANTED, id: props._id});
      if (+currentWanted === +props._id) {
        fetchWanted(props._id, true)(dispatch, getState);
      }
    }

  }
}

function updateWanted () {
  return function (dispatch, getState) {
    axios.get('/api/v2/wanted-albums?sort=title').then((res) => {
      const {wantedById, currentWanted} = getState().store;
      Object.keys(wantedById).forEach((id) => {
        const wanted = wantedById[id] || {};
        const current = res.data.find(el => +el._id === +id) || {};
        if (wanted.status !== current.status) {
          dispatch({type: INVALIDATE_WANTED, id});
          if (+currentWanted === +id) {
            fetchWanted(id, true)(dispatch, getState);
          }
        } else if (+current.dl_progress !== +wanted.dl_progress) {
          dispatch({
            type: FETCH_WANTED,
            id: id,
            wanted: {...wanted, dl_progress: current.dl_progress}
          });
        }
      });
      dispatch({
        type: FETCH_ALL_WANTED,
        wanted: res.data
      });
    });
  };
}

function searchWanted (id) {
  return function (dispatch, getState) {
    dispatch({type: INVALIDATE_WANTED, id});
    axios.post(`/api/v2/wanted-albums/${id}/searches`, {});
  }
}

function fetchAllWanted () {
  return function (dispatch) {
    axios.get('/api/v2/wanted-albums?sort=title').then((res) => {
      dispatch({
        type: FETCH_ALL_WANTED,
        wanted: res.data
      });
    })
  };
}
function clearWanted () {
  return {
    type: SET_WANTED,
    currentWanted: ''
  }
}
function fetchWanted (id, force = false) {
  return function (dispatch, getState) {
    dispatch({
      type: SET_WANTED,
      currentWanted: id
    });
    if (getState().store.wantedById[id]
      && !getState().store.wantedById[id].stale && !force) {
      return;
    }
    axios.get(`/api/v2/wanted-albums/${id}`).then((res1) => {
      return axios.get(
        `/api/v2/wanted-albums/${id}/results?sort=score&direction=desc&limit=15`
      ).then((res2) => {
        return Promise.resolve([res1.data, res2.data]);
      });
    }).then(([album, results]) => {
      dispatch({
        type: FETCH_WANTED,
        wanted: {
          ...album, results
        }
      });
    });
  };
}

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

function fetchAlbum(album) {
  const blank = {
    type: SET_ALBUM_RESULT,
    results: {}
  };
  return function (dispatch, getState) {
    const state = getState().store;
    if (state.query.album === album) {
      return dispatch(blank);
    }
    dispatch(setQuery({album}));
    if (state.albumsById[album]) {
      return dispatch(blank);
    }
    dispatch({
      type: SET_ALBUM_RESULT,
      results: {
        [album]: {loading: true}
      }
    });
    axios.get(`/api/v2/store/release-groups/${album}/release`)
      .then(({data}) => {
        if (!getState().store.albumsById[album].loading) {
          dispatch(blank);
        } else {
          dispatch({
            type: SET_ALBUM_RESULT,
            results: {
              [album]: data
            }
          });
        }
      }).catch((err) => {
        dispatch({
          type: SET_ALBUM_RESULT,
          results: {
            [album]: {
              loading: false,
              errored: true,
              error: err
            }
          }
        });
      });
  }
}

function fetchMoreAlbums () {
  const blank = {
    type: SET_ALBUMS_RESULTS,
    results: {}
  };
  return function (dispatch, getState) {
    const state = getState().store;
    const artist = state.query.albums;
    const current = state.albumsByQuery[artist];

    dispatch({
      type: SET_ALBUMS_RESULTS,
      results: {
        [artist]: [
          ...current.slice(0, -1),
          {
            loadingMore: true
          }
        ]
      }
    });
    axios.get(`/api/v2/store/artists/${
      state.query.albums
    }/release-groups?offset=${
      current.length - 1
    }`)
      .then(({data}) => {
        if (getState().store.albumsByQuery[artist].length
              !== current.length) {
          dispatch(blank);
        } else {
          dispatch({
            type: SET_ALBUMS_RESULTS,
            results: {
              [artist]: [
                ...current.slice(0, -1),
                ...data
              ]
            }
          });
        }
      });
  }
}

function addAlbumFilter (filter) {
  return {
    type: ADD_ALBUM_FILTER,
    filter
  }
}

function removeAlbumFilter (filter) {
  return {
    type: REMOVE_ALBUM_FILTER,
    filter
  }
}

function downloadAlbum (mbid, props) {
  return (dispatch, getState) => {
    axios.post('/api/v2/wanted-albums', {mbid, ...props}).then((res) => {
      fetchAllWanted()(dispatch, getState);
    });
  };
}

function selectResult (id, wantedId) {
  console.log('hey', id, wantedId);
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_WANTED,
      wanted: {
        ...wantedId,
        status: 'SNATCHING'
      }
    });
    axios.post('/api/v2/results/' + id + '/download');
  }
}

export const actionCreators = {
  fetchArtistsResult, fetchAlbumsResult, fetchArtistAlbums, fetchAlbum,
  fetchMoreAlbums, addAlbumFilter, removeAlbumFilter, fetchWanted,
  fetchAllWanted, downloadAlbum, clearWanted, updateWanted, searchWanted,
  invalidateWanted, toggleLossless, selectResult, onUpdate
}

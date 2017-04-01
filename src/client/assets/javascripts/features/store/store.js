import { createStructuredSelector } from 'reselect';
import assign  from 'lodash/assign';
import axios from 'axios';

const SEARCH_ARTISTS  = 'cassette/store/SEARCH_ARTISTS';
const SEARCH_ALBUMS   = 'cassette/store/SEARCH_ALBUMS';
const OPEN_ARTIST     = 'cassette/store/OPEN_ARTIST';
const OPEN_ALBUM      = 'cassette/store/OPEN_ALBUM';
const DOWNLOAD_ALBUM  = 'cassette/store/DOWNLOAD_ALBUM';
const SELECT_ARTIST   = 'cassette/store/SELECT_ARTIST';
const LOAD_ARTISTS    = 'cassette/store/LOAD_ARTISTS';
const LOAD_ALBUMS     = 'cassette/store/LOAD_ALBUMS';


const initialState = {
  artists: [],
  albums: [],
  artistsLoading: false,
  albumsLoading: false,
  selectedArtist: '',
  artist: {
    id: '',
    name: '',
    albums: []
  },
  album: {
    id: '',
    name: '',
    media: []
  }
}

export const NAME = 'store';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_ARTISTS:
      return Object.assign({}, state, {
        artists: action.data,
        selectedArtist: '',
        artistsLoading: false
      });
    case SEARCH_ALBUMS:
      return Object.assign({}, state, {
        albums: action.data,
        albumsLoading: false
      });
    case OPEN_ARTIST:
      return Object.assign({}, state, {
        albums: action.data
      });
    case OPEN_ALBUM:
      return Object.assign({}, state, {
        album: action.data
      });
    case SELECT_ARTIST:
      return Object.assign({}, state, {
        selectedArtist: action.mbid
      });
    case LOAD_ARTISTS:
      return Object.assign({}, state, {
        artistsLoading: true,
        artists: []
      });
    case LOAD_ALBUMS:
      return Object.assign({}, state, {
        albumsLoading: true,
        albums: []
      });
  }
  return state;
}

const store = (state) => state[NAME];

export const selector = createStructuredSelector({
  store
});

function searchArtists (query) {
  return axios.post('/api/v2/store/artists/searches', {
    query, limit: 10
  }).then(res => {
    return {
      data: res.data,
      type: SEARCH_ARTISTS
    }
  })
}
function searchAlbums (query) {
  return axios.post('/api/v2/store/release-groups/searches', {
    query, limit: 10
  }).then(res => {
    return {
      data: res.data,
      type: SEARCH_ALBUMS
    }
  })
}
function openArtist (id) {
  return axios.get(`/api/v2/store/artists/${id}/release-groups`).then((res) => {
    return {
      data: res.data,
      type: OPEN_ARTIST
    }
  })
}
function openAlbum (id) {
  return axios.get(`/api/v2/store/release-groups/${id}/release`)
    .then(({data}) => {
      return {
        type: OPEN_ALBUM,
        data
      }
    });
}
function selectArtist (mbid) {
  return {
    type: SELECT_ARTIST,
    mbid
  }
}
function loadArtists () {
  return {
    type: LOAD_ARTISTS
  }
}
function loadAlbums () {
  return {
    type: LOAD_ALBUMS
  }
}

export const actionCreators = {
  searchArtists, selectArtist, searchAlbums, openArtist, loadArtists, loadAlbums, openAlbum
}

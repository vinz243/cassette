
import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';

import { State } from 'models/playerStatus';

const TOGGLE_PAUSE = 'cassette/toolbar/TOGGLE_PAUSE';
const PLAY_PREVIOUS = 'cassette/toolbar/PLAY_PREVIOUS';
const PLAY_NEXT = 'cassette/toolbar/PLAY_NEXT';
const SET_VOLUME = 'cassette/toolbar/SET_VOLUME';
const SET_TRACK_TIME = 'cassette/toolbar/SET_TRACK_TIME';
const SET_VIEW_TYPE = 'cassette/toolbar/SET_VIEW_TYPE';
const SEARCH = 'cassette/toolbar/SEARCH';
const PLAY_TRACKS = 'cassette/shared/PLAY_TRACKS'; // SHARED namespace
const UPDATE_TIME = 'cassette/toolbar/UPDATE_TIME';

const PREVIOUS_TRESHOLD = 2000;

export const NAME = 'toolbar';

// const initialState: State = {
// 	playing: false,
// 	currentTrack: undefined,
// 	nextTrack: undefined,
// 	previousTrack:  undefined,
// 	currentTime: 0.0,
// 	viewType: 'redux-app/view-types/THUMBNAILS',
// 	searchString: '',
// 	volume: 1.0
// }


let rageArtist = {
  name: 'Rage Against The Machine',
  id: '42'
};

let rageAlbum = {
  name: 'Rage Against The Machine',
  id: '1337',
  artist: rageArtist
};

const initialState: State = {
	playing: false,
	currentTrack: undefined,
	nextTrack: undefined,
	previousTrack: undefined,
	currentTime: 0,
	viewType: 'redux-app/view-types/THUMBNAILS',
	searchString: '',
	volume: 1.0
};

let srcUrl = (id) => {
  return `/v1/tracks/${id}/file`;
};

let audio = new Audio();
export default function reducer(state: State = initialState, action: any = {}): State {
	let newState = {};
	assign(newState, state);
	switch (action.type) {
    case UPDATE_TIME:
      newState.currentTime = audio.currentTime * 1000;
      return newState;

		case TOGGLE_PAUSE:
      if (audio) {
			  newState.playing = !newState.playing;
        if (newState.playing)
          audio.play();
        else audio.pause();
      }
			return newState;

		case PLAY_PREVIOUS:
			if (state.currentTime > PREVIOUS_TRESHOLD) {
				newState.currentTime = 0.0;
        audio.currentTime = 0.0;
        if (newState.playing)
          audio.play();
				return newState;
			}
			if (!state.previousTrack) return newState;

			newState.currentTrack = state.previousTrack;
			newState.previousTrack = undefined;
			newState.currentTime = 0.0;
			newState.nextTrack = state.currentTrack;

      audio.src = srcUrl(newState.currentTrack.id);
      if (newState.playing)
        audio.play();
			return newState;

		case PLAY_NEXT:
			if (!state.nextTrack) return newState;

			newState.currentTrack = state.nextTrack;
			newState.nextTrack = undefined;
			newState.currentTime = 0.0;
			newState.previousTrack = state.currentTrack;
      audio.src = srcUrl(newState.currentTrack.id);

      if (newState.playing)
        audio.play();

			return newState;

		case SET_VOLUME:
			newState.volume = Math.min(Math.max(action.value, 0.0), 1.0);
      audio.volume = newState.volume;
			return newState;

		case SET_TRACK_TIME:
			if (!state.currentTrack) return newState;

			newState.currentTime = Math.min(Math.max(action.value, 0.0), state.currentTrack.duration);
      audio.currentTime = newState.currentTime / 1000;

			return newState;

    case PLAY_TRACKS:
      newState.currentTrack = action.tracks[0];
      newState.previousTrack = state.currentTrack;
      newState.nextTrack = action.tracks[1];
      newState.playing = true;
      newState.currentTime = 0.0;

      audio.src = srcUrl(newState.currentTrack.id);
      audio.play();

      return newState;
		case SET_VIEW_TYPE:
			return newState;

		case SEARCH:
			newState.searchString = action.value;
			return newState;

		default:
			return newState;

	}
};
// export NAME = NAME;
const toolbar = (state) => state[NAME];

export const selector = createStructuredSelector({
	toolbar
});

function togglePause() {
	return {
		type: TOGGLE_PAUSE
	}
}

function playPrevious() {
	return {
		type: PLAY_PREVIOUS
	}
}

function playNext() {
	return {
		type: PLAY_NEXT
	}
}

function setVolume(value: float) {
	return {
		type: SET_VOLUME,
		value
	}
}

function seek(value: float) {
	return {
		type: SET_TRACK_TIME,
		value
	}
}

function setViewType(value: string) {
	return {
		type: SET_VIEW_TYPE,
		value
	}
}

function search(value: string) {
	return {
		type: SEARCH,
		value
	}
}

function updateTime() {
  return {
    type: UPDATE_TIME
  };
}


export const actionCreators = {
	togglePause, playPrevious, playNext, setVolume, seek, setViewType, search, updateTime
}


import { createStructuredSelector } from 'reselect';
import assign from 'lodash/assign';

import { State } from 'models/playerStatus';

const TOGGLE_PAUSE = 'redux-app/toolbar/TOGGLE_PAUSE';
const PLAY_PREVIOUS = 'redux-app/toolbar/PLAY_PREVIOUS';
const PLAY_NEXT = 'redux-app/toolbar/PLAY_NEXT';
const SET_VOLUME = 'redux-app/toolbar/SET_VOLUME';
const SET_TRACK_TIME = 'redux-app/toolbar/SET_TRACK_TIME';
const SET_VIEW_TYPE = 'redux-app/toolbar/SET_VIEW_TYPE';
const SEARCH = 'redux-app/toolbar/SEARCH';

const PREVIOUS_TRESHOLD = 2000;

export const NAME = 'toolbar';

const initialState: State = {
	playing: false,
	currentTrack: undefined,
	nextTrack: undefined,
	previousTrack:  undefined,
	currentTime: 0.0,
	viewType: 'redux-app/view-types/THUMBNAILS',
	searchString: '',
	volume: 1.0
}

export default function reducer(state: State = initialState, action: any = {}): State {
	let newState = {};
	assign(newState, state)	;

	switch (action.type) {
		case TOGGLE_PAUSE:
			newState.playing = !newState.playing;
			return newState;

		case PLAY_PREVIOUS:
			if (state.currentTime > PREVIOUS_TRESHOLD) {
				newState.currentTime = 0.0;
				return newState;
			}
			if (!state.previousTrack) return newState;

			newState.currentTrack = state.previousTrack;
			newState.previousTrack = undefined;
			newState.currentTime = 0.0;
			newState.nextTrack = state.currentTrack;
			return newState;

		case PLAY_NEXT:
			if (!state.nextTrack) return newState;

			newState.currentTrack = state.nextTrack;
			newState.nextTrack = undefined;
			newState.currentTime = 0.0;
			newState.previousTrack = state.currentTrack;
			return newState;

		case SET_VOLUME:
			newState.volume = Math.min(Math.max(action.value, 0.0), 1.0);
			return newState;

		case SET_TRACK_TIME:
			if (!state.currentTrack) return newState;

			newState.currentTime = Math.min(Math.max(action.value, 0.0), state.currentTrack.duration);

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


export const actionCreators = {
	togglePause, playPrevious, playNext, setVolume, seek, setViewType, search
}
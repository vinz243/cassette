type Artist = {
	name: string,
	id: string
}

type Album = {
	name: string,
	artist: Artist,
	id: string
}

type Track = {
	name: string,
	artist: Artist,
	album: Album,
	id: string,
	duration: double
}

export type State = {
	playing: boolean,
	currentTrack: Track,
	nextTrack: Track,
	previousTrack: Track,
	currentTime: double,
	viewType: string,
	searchString: string,
	volume: float
};
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

type Item = {
  artist: Artist,
  album: Album,
  track: Track,
  id: string
}

export type State = {
  items: Array<Item>,
  viewType: string, // LIST or THUMBNAILS
  viewScope: string, // 'ARTISTS', 'ALBUMS', 'TRACKS'
}

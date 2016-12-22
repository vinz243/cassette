type Item = {
  name: string,
  id: string,
  type: string
}

export type State = {
  items: Array<Item>,
  viewType: string, // LIST or THUMBNAILS
  viewScope: string, // 'ARTISTS', 'ALBUMS', 'TRACKS'
}

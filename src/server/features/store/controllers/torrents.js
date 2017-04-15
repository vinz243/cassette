const Tracker      = require('features/store/models/tracker');
const Torrent      = require('features/store/models/torrent');
const WantedAlbum  = require('features/store/models/wanted-album');
const trackersList = require('features/store/trackers');
const RTorrent     = require('features/store/rtorrent');
const assert       = require('assert');
const request      = require('request-promise-native');
const {mainStory}  = require('storyboard');
const thenifyAll   = require('thenify-all');
const musicbrainz  = thenifyAll(require('musicbrainz'));
const fs = require('fs');
module.exports.snatch = async function (id) {
  const torrent = await Torrent.findById(id)
  const tracker = await Tracker.findById(torrent.props.tracker);
  const wanted  = await WantedAlbum.findById(torrent.props.wanted_album._id);
  // assert(wanted.props.status === 'SEARCHED');

  wanted.set('status', 'SNATCHING');
  await wanted.update();

  const api = await trackersList[tracker.props.type](request, tracker);

  const buffer = await api.download(torrent.props.torrent_id);
  fs.writeFile('/home/vincent/filetest', buffer, console.log);
  const item = await RTorrent.addTorrent(buffer);

  torrent.set('info_hash', item.infoHash);
  await torrent.update();

  wanted.set('status', 'DOWNLOADING');
  await wanted.update();

  const poller = setInterval(() => {
    item.getProgress().then((progress) => {
      if (progress >= 1) {
        clearInterval(poller);
        wanted.set('status', 'DONE');
      }
      wanted.set('dl_progress', progress);
      torrent.set('dl_progress', progress);
      return Promise.all([wanted.update(), torrent.update()]);
    });
  }, 600);
  setTimeout(() => {
    item.getProgress().then((progress) => {
      if (progress === 0) {
        clearInterval(poller);
        wanted.set('status', 'FAILED');
        wanted.update();
      }
    });
  }, 1.5 * 60 * 60 * 1000);
}

module.exports.search = async function (id) {
  const album = await WantedAlbum.findById(id);
  const {set, update, props} = album;

  const res = await musicbrainz.lookupReleaseGroup(props.mbid,
    ['artists']);

  const artist = res.artistCredits[0].artist;
  album.set('title', res.title.replace(/\(.+\)/, ''));
  album.set('artist', artist.name);
  album.set('date', res.firstReleaseDate);
  await album.update();

  if (props.partial) {
    throw 'Partial downloads not implemented yet :/';
  }
  if (props.status !== 'WANTED') {
    throw 'Entry already being searched';
  }
  set('status', 'SEARCHING_TRACKERS');

  await update();
  const promises = (await Tracker.find({})).map(async (tracker) => {
    try {
      const api = await trackersList[tracker.props.type](request, tracker);

      await api.searchReleases(album);
    } catch (err) {
      mainStory.warn('store', `Couldn't search ${tracker.props.name}`, {
        attach: err
      })
    }
  });
  await Promise.all(promises);
  set('status', 'SEARCHED');
  await update();

}

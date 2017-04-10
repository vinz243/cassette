const chalk       = require('chalk');
const utils       = require('./utils');
const assert      = require('assert');
const {mainStory} = require('storyboard');
const torrent     = require('features/store/models/torrent');

module.exports = async function (request, tracker) {
  const {username, host = 't411.ai'} = tracker.props;
  const password = tracker.privateProps.password;

  assert.equal(tracker.props.type, 't411');

  const {error, token} = await request.post(`https://api.${host}/auth`, {
    form: {username, password},
    json: true
  });
  if (!token) {
    throw new Error(`Remote error: ${error}`);
  }

  return {
    searchReleases: async (wanted) => {
      const {partial, artist, title, _id, want_lossless} = wanted.props;
      assert(_id);

      if (!partial) {
        const url = `https://api.${host}/torrents/search/${
          utils.formatToURL(artist)
        }+${
          utils.formatToURL(title)
        }?cid=623`;
        const time = Date.now();

        const {torrents, error} = await request({url, headers: {
          Authorization: token
        }, json: true});

        mainStory.debug('store', `GET ${
          chalk.dim(url)
        } - ${Date.now() - time}ms`);

        if (!torrents) {
          throw new Error(`Remote: ${error}`);
        }
        const releases = torrents.map((el) => torrent({
          wanted_album: _id,
          tracker: tracker.props._id,
          torrent_id: el.id,
          seeders: el.seeders,
          leechers: el.leechers,
          size: el.size,
          name: el.name,
          want_lossless,
          format: el.name.toLowerCase().includes('mp3') ? 'mp3' :
            (el.name.toLowerCase().includes('flac') ? 'flac' : undefined),
          bitrate: utils.extractBitrateFromName(el.name)
        }));

        await Promise.all(releases.map(el => el.create()));
      }
    }
  };
}

const chalk       = require('chalk');
const utils       = require('./utils');
const assert      = require('assert');
const {mainStory} = require('storyboard');
const release     = require('../release');

module.exports = async function (request, tracker) {
  const {username, password, host = 't411.ai'} = tracker.props;

  assert.equal(tracker.props.type, 't411');

  const {error, token} = await request.post(`https://api.${host}/auth`, {
    form: {username, password},
    json: true
  });
  if (!token) {
    throw new Error(`Remote error: ${error}`);
  }

  return {
    searchReleases: async (search) => {
      const {query, type, mrel_type, artist, lossless, _id} = search.props;

      assert(_id);

      if (type === 'release') {
        const url = `https://api.${host}/torrents/search/${
          utils.formatToURL(artist)
        }+${
          utils.formatToURL(query)
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
        const releases = torrents.map((torrent) => release({
          release_search: _id,
          tracker: tracker.props._id,
          rid: torrent._id,
          seeders: torrent.seeders,
          leechers: torrent.leechers,
          size: torrent.size,
          name: torrent.name,
          format: torrent.name.toLowerCase().includes('mp3') ? 'mp3' :
            (torrent.name.toLowerCase().includes('flac') ? 'flac' : undefined),
          bitrate: utils.extractBitrateFromName(torrent.name)
        }));

        await Promise.all(releases.map(release => release.create()));
      }
    }
  };
}

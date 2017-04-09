const chalk       = require('chalk');
const utils       = require('./utils');
const assert      = require('assert');
const {mainStory} = require('storyboard');
const torrent     = require('features/store/models/torrent');
const querystring = require('querystring');

module.exports = async function (req, tracker) {
  const {username, password, host = 'passtheheadphones.me'} = tracker.props;

  assert.equal(tracker.props.type, 'gazelle');

  const jar     = req.jar();
  const request = req.defaults({jar});

  const res = await request.post({
    url: `https://${host}/login.php`,
    form: {username, password},
    resolveWithFullResponse: true,
    followRedirects: false,
    simple: false
  });

  if (res.statusCode === 200) {
    throw new Error(`Remote error: couldn't login`);
  }

  return {
    searchReleases: async (wanted) => {
      const {partial, artist, name, _id} = wanted.props;
      assert(_id);

      if (!partial) {
        const url = `https://${host}/ajax.php?${querystring.stringify({
          action: 'browse',
          searchstr: '',
          artistname: artist,
          groupname: name
        })}`;
        const time = Date.now();

        const {response, status} = await request({url, json: true});

        mainStory.debug('store', `GET ${
          chalk.dim(url)
        } - ${Date.now() - time}ms`);

        if (status !== 'success' || !response) {
          throw new Error(`Remote: ${error}`);
        }
        if (!response.results.length) {
          return;
        }
        const releases = response.results[0].torrents.map((el) => torrent({
          wanted_album: _id,
          tracker: tracker.props._id,
          torrent_id: el.torrentId,
          seeders: el.seeders,
          leechers: el.leechers,
          size: el.size,
          name: `${artist} - ${name} (${el.format} ${el.encoding})`,
          format: el.format.toLowerCase(),
          bitrate: el.encoding
        }));
        console.log(releases.map(rel => rel.props));
        await Promise.all(releases.map(el => el.create()));
      }
    }
  };
}

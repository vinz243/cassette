const chalk       = require('chalk');
const utils       = require('./utils');
const assert      = require('assert');
const {mainStory} = require('storyboard');
const torrent     = require('features/store/models/torrent');
const querystring = require('querystring');

const timetrickle = require('timetrickle');
const limiter = timetrickle(5, 10000);

const limit = function () {
  return new Promise((resolve, reject) => {
    limiter(() => {
      resolve();
    })
  });
}

module.exports = async function (req, tracker) {
  const {username, host = 'passtheheadphones.me'} = tracker.props;
  const password = tracker.privateProps.password;

  assert.equal(tracker.props.type, 'gazelle');

  if (!username || !password) {
    throw new Error(`No username or password specified`);
  }

  const jar     = req.jar();
  const request = req.defaults({jar});

  await limit();
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
    download: async (torrentId) => {
      assert(torrentId);

      const url = `https://${host}/torrents.php?${querystring.stringify({
        id: torrentId
      })}`;
      await limit();
      const time = Date.now();
      const buffer = await request({url, encoding: null});

      mainStory.debug('store', `GET ${
        chalk.dim(url)
      } - ${Date.now() - time}ms`);

      return buffer;

    },
    searchReleases: async (wanted) => {
      const {partial, artist, title, _id, want_lossless} = wanted.props;
      assert(_id);

      if (!partial) {
        const url = `https://${host}/ajax.php?${querystring.stringify({
          action: 'browse',
          searchstr: '',
          artistname: artist,
          groupname: title
        })}`;
        await limit();
        const time = Date.now();
        const {response, status} = await request({url, json: true});

        mainStory.debug('store', `GET ${
          chalk.dim(url)
        } - ${Date.now() - time}ms`);

        if (status !== 'success' || !response) {
          console.log(response, status);
          throw new Error(`Remote: error`);
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
          want_lossless,
          size: el.size,
          name: `${artist} - ${title} (${el.format} ${el.encoding})`,
          format: el.format.toLowerCase(),
          bitrate: el.encoding
        }));

        await Promise.all(releases.map(el => el.create()));
      }
    }
  };
}

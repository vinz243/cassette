import defaults from 'lodash/defaults';
import config from '../../config.js';
import {mainStory} from 'storyboard';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import {getClosestSize} from './sizes';
const defaultOpts = {
  apiKey: '85d5b036c6aa02af4d7216af592e1eea'
}

function fetchArtistArtwork (fs, path, touch, request, qs, md5, conf, artist) {
  if (!artist) {
    return Promise.resolve();
  }

  const dataDir = path.join(config.get('configPath'), 'artworks');
  mkdirp.sync(dataDir);

  let hash = md5(qs.stringify({
    entity: 'artist_artwork',
    artist: artist
  }));

  let filePath = path.join(dataDir, hash);

  if (fs.existsSync(filePath)) {
    mainStory.trace('artwork-agent', `Artwork for ${artist} already exists`);
    return Promise.resolve();

  } else {
    // This creates the file at specified path, like a lock file
    touch.sync(filePath);

    mainStory.info('artwork-agent', `Trying to find artwork for ${artist}`);

    const params = {
      method: 'artist.getinfo',
      api_key: config.get('lastFMAPIKey'),
      artist: artist,
      format: 'json'
    };

    const url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);
    const time = Date.now();
    return request(url).then(json => {
      // Log time
      mainStory.info('artwork-agent',
        `GET ${chalk.dim(url)} - ${Date.now() - time}ms`);

      const data = JSON.parse(json);
      if (data.error) {
        return Promise.resolve([]);
      }
      // Create a list of available sizes
      // We remove the mega size because it isn't a regular square
      const availableSizes = data.artist.image.map(s => s.size)
        .filter(size => size !== 'mega');

      if (!availableSizes.length) {
        return Promise.resolve([]);
      }

      // Try to find the largest size
      const target = getClosestSize(1200, availableSizes);

      // Get corresponding url
      const imageUrl = data.artist.image
        .find(el => el.size === target)['#text'];
      // if nothing found, resolve empty
      if (!imageUrl) {
        return Promise.resolve([]);
      }

      // Try to fetch image
      return request({
        url: imageUrl, encoding: null
      }).then((buffer) => Promise.resolve([buffer, Date.now(), imageUrl]));
    }).then(([buffer, date, url]) => {

      // No buffer, image does not exists
      if (!buffer) {
        mainStory.warn('artwork-agent', `No artwork found for ${artist}`);
        return Promise.resolve();
      }

      mainStory.info('artwork-agent',
        `GET ${chalk.dim(url)} - ${Date.now() - date}ms`);

      // Save image to disk
      return fs.writeFile(filePath, buffer).then(() => Promise.resolve());
    });
  }
}

export function fetchArtistArtworkFactory (fsp, path, touch, request, qs, md5,
  conf) {
  return fetchArtistArtwork.bind(null, fsp, path, touch, request, qs, md5,
    conf);
}

export function agent (fetchArtistArtwork, fetchAlbumArtwork, options) {
  return function (metadata, next) {
    let opts = defaults(options, defaultOpts);

    process.nextTick(() => {
      fetchArtistArtwork(metadata.artist).then(
        () => fetchAlbumArtwork(metadata.album)
      );
    });
    next();
  }
}

export function agentFactory (fetchArtistArtwork, fetchAlbumArtwork) {
  return agent.bind(null, fetchArtistArtwork, fetchAlbumArtwork);
}

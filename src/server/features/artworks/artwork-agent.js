import defaults from 'lodash/defaults';
import config from '../../config.js';
import {mainStory} from 'storyboard';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import {getClosestSize} from './sizes';
import assert from 'assert';

function fetchEntityArtwork (fs, path, touch, request, qs, md5, conf, entity,
  entityName, parent) {

  assert(['artist', 'album'].includes(entity));

  if (!entityName) {
    return Promise.resolve();
  }

  const dataDir = path.join(config.get('configPath'), 'artworks');
  mkdirp.sync(dataDir);

  let hash = md5(qs.stringify({
    entity: `${entity}_artwork`,
    [entity]: entityName
  }));

  let filePath = path.join(dataDir, hash);

  if (fs.existsSync(filePath)) {
    mainStory.trace('artwork-agent', `Artwork for ${entityName} already exists`);
    return Promise.resolve();

  } else {
    // This creates the file at specified path, like a lock file
    touch.sync(filePath);

    mainStory.info('artwork-agent', `Trying to find artwork for ${entityName}`);

    const params = Object.assign({}, {
      method: `${entity}.getinfo`,
      api_key: config.get('lastFMAPIKey'),
      [entity]: entityName,
      format: 'json'
    }, parent ? {artist: parent} : {});

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
      const availableSizes = data[entity].image.map(s => s.size)
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
        mainStory.warn('artwork-agent', `No artwork found for ${entityName}`);
        return Promise.resolve();
      }

      mainStory.info('artwork-agent',
        `GET ${chalk.dim(url)} - ${Date.now() - date}ms`);

      // Save image to disk
      return fs.writeFile(filePath, buffer).then(() => Promise.resolve());
    });
  }
}

export function fetchEntityArtworkFactory (fsp, path, touch, request, qs, md5,
  conf) {
  return fetchEntityArtwork.bind(null, fsp, path, touch, request, qs, md5,
    conf);
}

export function agent (fetchArtwork, options) {
  return function (metadata, next) {
    let opts = defaults(options, defaultOpts);

    process.nextTick(() => {
      const album = () => {
        fetchArtwork('album', metadata.album, metadata.artist);
      };
      fetchArtwork('artist', metadata.artist).then(album);
    });
    next();
  }
}

export function agentFactory (fetchArtistArtwork, fetchAlbumArtwork) {
  return agent.bind(null, fetchArtistArtwork, fetchAlbumArtwork);
}

const defaults  = require("lodash/defaults");
const mainStory = require('storyboard').mainStory;
const chalk     = require("chalk");
const mkdirp    = require("mkdirp");
const assert    = require("assert");
const config     = require("../../config.js");

const {getClosestSize} = require('./sizes');

const MAX_RETRIES = 0;

function fetchEntityArtwork (fs, path, touch, request, qs, md5, conf, entity,
  entityName, parent, retries = 0) {

  assert(['artist', 'album'].includes(entity));

  if (Number.isInteger(parent - 0) && entity === 'artist') {
    retries = parent - 0;
    parent = null;
  }

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

  if (fs.existsSync(filePath + '.lock') || fs.existsSync(filePath)) {
    mainStory.trace('artwork-agent', `Artwork for ${entityName} already exists`);
    return Promise.resolve();

  } else {
    // This creates the file at specified path, like a lock file
    touch.sync(filePath + '.lock');

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
        mainStory.info('artwork-agent', `Cannot fetch artwork for ${entity} ${
          parent ? parent : ''
        }`, {attach: data});
        return Promise.resolve([]);
      }
      // Create a list of available sizes
      // We remove the mega size because it isn't a regular square
      const availableSizes = data[entity].image.map(s => s.size)
        .filter(size => (size !== 'mega' && size));

      if (!availableSizes.length) {
        mainStory.info('artwork-agent', `No artworks available for ${entity} ${
          parent ? parent : ''
        }`);
        return Promise.resolve([]);
      }

      // Try to find the largest size
      const target = getClosestSize(1200, availableSizes);

      // Get corresponding url
      const imageUrl = data[entity].image
        .find(el => el.size === target)['#text'];
      // if nothing found, resolve empty
      if (!imageUrl) {
        mainStory.info('artwork-agent', `No image URL available for ${entity} ${
          parent ? parent : ''
        }`);
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
      return fs.writeFile(filePath, buffer);
    }).then(() => {
      if ((!fs.existsSync(filePath) || fs.lstatSync(filePath).size < 20)
        && retries < MAX_RETRIES) {
        mainStory.warn('artwork-agent', `Retrying for ${entityName}`);

        return fs.unlink(filePath + '.lock').then(function () {
          return fs.existsSync(filePath) && fs.unlink(filePath);
        }).then(function () {
          return fetchEntityArtwork(fs, path, touch, request, qs, md5, conf,
            entity, entityName, parent, retries + 1);
        });
      }
      // Don't forget to release lock!
      return fs.unlink(filePath + '.lock');
    }).catch((err) => {
      mainStory.error('artwork-agent', 'Uncaught error', {attach: err});
      fs.unlink(filePath + '.lock');
    });
  }
}

const fetchEntityArtworkFactory = module.exports.fetchEntityArtworkFactory = function (fsp, path, touch, request, qs, md5,
  conf) {
  return fetchEntityArtwork.bind(null, fsp, path, touch, request, qs, md5,
    conf);
}

function agent (fetchArtwork) {
  const stack = Promise.resolve();
  return function (md, next) {
    if (md.artist && md.album) {
      const artist = fetchArtwork.bind(null, 'artist', md.artist);
      const album = fetchArtwork.bind(null, 'album', md.album, md.artist);
      stack.then(album).then(artist);
    } else if (md.artist && !md.album) {
      const artist = fetchArtwork.bind(null, 'artist', md.artist);
      stack.then(artist);
    }
    next();
  }
}

const agentFactory = module.exports.agentFactory = function (fetch) {
  return agent.bind(null, fetch);
}

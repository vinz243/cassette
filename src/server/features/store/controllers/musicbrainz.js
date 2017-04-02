const thenifyAll  = require('thenify-all');
const qs          = require('qs');
const sharp       = require('sharp');
const config       = require('config');
const request     = require('request-promise-native');
const musicbrainz = thenifyAll(require('musicbrainz'));

const {getClosestSize} = require('features/artworks/sizes');

const {mainStory} = require('storyboard');

const cache = {};
const MAX_CACHE_SIZE = 20; // Allows caching of 20 artworks
const keys = [];

module.exports = {
  '/api/v2/store/artists/:mbid': {
    get: async function (ctx) {
      const {
        id,
        type,
        name,
        country,
        disambiguation,
        lifeSpan
      } = await musicbrainz.lookupArtist(ctx.params.mbid, []);
      ctx.body = {id, type, name, country, disambiguation, lifeSpan};
      ctx.status = 200;
    }
  },
  '/api/v2/store/artists/searches': {
    post: async function (ctx) {
      let q = Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {}, {filter: {}});

      const {artists} = await request.get({
        url: `https://musicbrainz.org/ws/2/artist?query=${
          q.query
        }&fmt=json&limit=${q.limit}`,
        headers: {
          'User-Agent': musicbrainz.userAgent()
        },
        json: true
      });
      ctx.body = artists;
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/:mbid': {
    get: async function (ctx) {
      const res = await musicbrainz.lookupReleaseGroup(ctx.params.mbid,
        ['artists']);

      const artist  = group.artistCredits[0].artist;
      ctx.body = {
        id: res.id,
        type: res.type,
        title: res.title,
        firstReleaseDate: res.firstReleaseDate,
        artist
      }
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/searches': {
    post: async function (ctx) {
      let q = Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {}, {filter: {}});

      const res = await request.get({
        url: `https://musicbrainz.org/ws/2/release-group?query=${
          q.query
        }&fmt=json&limit=${q.limit}`,
        headers: {
          'User-Agent': musicbrainz.userAgent()
        },
        json: true
      });
      ctx.body = res['release-groups'];
      ctx.status = 200;
    }
  },
  '/api/v2/store/artists/:mbid/release-groups': {
    get: async function (ctx) {
      let q = ctx.query;

      const res = await request.get({
        url: `https://musicbrainz.org/ws/2/release-group?query=arid:${
          ctx.params.mbid
        }&fmt=json&limit=${q.limit}`,
        headers: {
          'User-Agent': musicbrainz.userAgent()
        },
        json: true
      });
      ctx.body = res['release-groups'];
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/:mbid/release': {
    get: async function (ctx) {
      const group = await request.get({
        url: `https://musicbrainz.org/ws/2/release-group/${
          ctx.params.mbid
        }?inc=artist-credits%2Breleases&fmt=json`,
        headers: {
          'User-Agent': musicbrainz.userAgent()
        },
        json: true
      });
      const releases = group.releases.filter((rel) => {
        return rel.date === group['first-release-date'];
      });

      if (!releases.length) {
        mainStory.warn('store', `No release found for ${
          group.title} with date ${group['first-release-date']}`, {
            attach: group.releases
          });
        return;
      }

      if (releases.length > 1) {
        mainStory.warn('store', `Several releases found for ${
          group.title} with date ${group['first-release-date']
          }, dropping last releases`, {
            attach: releases
          });
      }
      const [release] = releases;
      const artist  = group['artist-credit'][0].artist;
      const res = {
        title: group.title,
        id: release.id,
        artist: artist.name,
        artistId: artist.id,
        date: release.date,
        groupId: group.id,
        status: release.status['#'],
      }
      const {media} = await request.get({
        url:`http://musicbrainz.org/ws/2/release/${
          release.id
        }?inc=recordings&fmt=json`,
        headers: {
          'User-Agent': musicbrainz.userAgent()
        },
        json: true
      });

      res.media = media;

      ctx.body = res;
      ctx.status = 200;
    }
  },
  '/api/v2/store/artists/:mbid/artwork': {
    get: async function (ctx) {
      const {size = 300} = ctx.query;
      const {name} = await musicbrainz.lookupArtist(ctx.params.mbid, []);

      const params = {
        method: `artist.getinfo`,
        api_key: config.get('lastFMAPIKey'),
        artist: name,
        format: 'json'
      };

      let query = qs.stringify(params);
      let buffer = null;

      if (cache[query]) {

        buffer = cache[query];
      } else {
        const url  = 'http://ws.audioscrobbler.com/2.0/?' + query;

        const data = await request.get({url, json: true});

        if (data.error) {
          ctx.status = 500;
          ctx.body = data;
          return;
        }

        const availableSizes = data.artist.image.map(s => s.size)
          .filter(size => (size !== 'mega' && size));

        if (!availableSizes.length) {
          ctx.status = 404;
          return;
        }

        const target = getClosestSize(300, availableSizes);

        const imageUrl = data.artist.image
          .find(el => el.size === target)['#text'];

        if (!imageUrl) {
          return;
        }

        buffer = await request({
          url: imageUrl, encoding: null
        });

        if (keys.length >= MAX_CACHE_SIZE) {
          delete cache[keys.shift()];
        }

        keys.push(query);
        cache[query] = buffer;
      }


      ctx.body = await sharp(buffer).resize(size - 0, size - 0).toBuffer();

      ctx.set('Content-Type', 'image/png');
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/:mbid/artwork': {
    get: async function (ctx) {
      const {size = 300} = ctx.query;
      const res = await musicbrainz.lookupReleaseGroup(ctx.params.mbid,
        ['artists']);

      const params = {
        method: `album.getinfo`,
        api_key: config.get('lastFMAPIKey'),
        artist: res.artistCredits[0].artist.name,
        album: res.title,
        format: 'json'
      };

      let query = qs.stringify(params);
      let buffer = null;

      if (cache[query]) {

        buffer = cache[query];
      } else {
        const url  = 'http://ws.audioscrobbler.com/2.0/?' + query;

        const data = await request.get({url, json: true});

        if (data.error) {
          ctx.status = 500;
          ctx.body = data;
          return;
        }

        const availableSizes = data.album.image.map(s => s.size)
          .filter(size => (size !== 'mega' && size));

        if (!availableSizes.length) {
          ctx.status = 404;
          return;
        }

        const target = getClosestSize(300, availableSizes);

        const imageUrl = data.album.image
          .find(el => el.size === target)['#text'];

        if (!imageUrl) {
          return;
        }

        buffer = await request({
          url: imageUrl, encoding: null
        });

        if (keys.length >= MAX_CACHE_SIZE) {
          delete cache[keys.shift()];
        }

        keys.push(query);
        cache[query] = buffer;
      }


      ctx.body = await sharp(buffer).resize(size - 0, size - 0).toBuffer();

      ctx.set('Content-Type', 'image/png');
      ctx.status = 200;
    }
  }
};

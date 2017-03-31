const thenifyAll  = require('thenify-all');
const musicbrainz = thenifyAll(require('musicbrainz'));

module.exports = {
  '/api/v2/store/artists/:mbid': {
    get: async function (ctx) {
      const {
        id,
        type,
        name,
        country,
        lifeSpan
      } = await musicbrainz.lookupArtist(ctx.params.mbid, []);
      ctx.body = {id, type, name, country, lifeSpan};
      ctx.status = 200;
    }
  },
  '/api/v2/store/artists/searches': {
    post: async function (ctx) {
      let q = Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {}, {filter: {}});

      ctx.body = (await musicbrainz.searchArtists(q.query, q.filter)).map(el => {
        const {id, type, name, country, lifeSpan} = el;
        return {id, type, name, country, lifeSpan};
      });
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/:mbid': {
    get: async function (ctx) {
      const res = await musicbrainz.lookupReleaseGroup(ctx.params.mbid, []);
      ctx.body = {
        id: res.id,
        type: res.type,
        title: res.title,
        firstReleaseDate: res.firstReleaseDate
      }
      ctx.status = 200;
    }
  },
  '/api/v2/store/release-groups/searches': {
    post: async function (ctx) {
      let q = Object.assign({}, ctx.request.fields || {},
        ctx.request.body || {}, {filter: {}});

      ctx.body = (await musicbrainz.searchReleaseGroups(q.query, q.filter))
        .map(el => {
          const {id, type, title, firstReleaseDate} = el;
          return  {id, type, title, firstReleaseDate};
        });
      ctx.status = 200;
    }
  },
  '/api/v2/store/artists/:mbid/release-groups': {
    get: async function (ctx) {
      const res = await musicbrainz.lookupArtist(ctx.params.mbid, [
        'release-groups'
      ]);
      ctx.body = res.releaseGroups.map(el => {
        const {id, type, title, firstReleaseDate} = el;
        return {id, type, title, firstReleaseDate};
      });
      ctx.status = 200;
    }
  }
};

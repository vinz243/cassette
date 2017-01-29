import LastFM from './LastFM';

const lastFM = new LastFM();

export default {
  '/v1/store/searches': {
    post: async (ctx, next) => {
      let body = ctx.request.fields || ctx.request.body || {};

      let res = await Promise.all([
        lastFM.searchTrack(body.query, body.limit, body.page).then(LastFM.parseResult),
        lastFM.searchAlbum(body.query, body.limit, body.page).then(LastFM.parseResult),
      ]);

      ctx.status = 201;
      ctx.body = {
        payload: {
          body: body
        },
        success: true,
        data: {
          tracks: res[0],
          albums: res[1]
        }
      };
    }
  }
};

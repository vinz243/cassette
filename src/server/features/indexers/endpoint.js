import GazelleAPI from './GazelleAPI';
import config from '../../config';
import {pull} from '../store/database';

export const api = new GazelleAPI({
  username: config.get('pthUsername'),
  password: config.get('pthPassword')
});

export default {
  '/v1/store/:id/releases': {
    get: async (ctx, next) => {
      let data = pull(ctx.params.id);
      if (!data) {
        ctx.status = 404;
        ctx.body = {
          payload: {params: {id: ctx.params.id}},
          sucess: false,
          data: {}
        };
        return;
      }
      let res = await api.login().then(() => {
        return api.searchTorrents(`${data.artist} ${data.name}`);
      });
      ctx.status = 200;
      ctx.body = {
        payload: {
          params: {
            id: ctx.params.id
          }
        },
        sucess: true,
        data: res.map(r => r.data)
      };
    }
  }
}

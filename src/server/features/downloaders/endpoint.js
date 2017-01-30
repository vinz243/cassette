import RTorrent from './rTorrent';
import config from '../../../../config';
import {pull} from '../store/database';
import {api} from '../indexers';
const rTorrent = new RTorrent();

export default {
  '/v1/releases/:id/downloads': {
    post: async (ctx, next) => {
      let release = pull(ctx.params.id);
      if (!release) {
        ctx.status = 404;
        ctx.body = {
          payload: {params: {id: ctx.params.id}},
          sucess: false,
          data: {}
        };
        return;
      }
      let raw = await api.getRawTorrent(release.torrentId);
      let res = await rTorrent.addTorrent(raw);
      ctx.status = 201;
      ctx.body = {
        payload: {
          params: {
            id: ctx.params.id
          }
        },
        sucess: true,
        data: {}
      };
    }
  }
};

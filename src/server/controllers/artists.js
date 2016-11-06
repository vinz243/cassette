import {Artist, Album, Tracks} from '../models';
import Lazy from 'lazy.js';
const routes = {

  '/v1/artists': {
    // returns a list of artists and their associated metadata
    get: async (ctx, next) => {
      let res = Artist.find(ctx.query);
      ctx.body = {
        status: 'success',
        data: res.map(d => d.body),
        length: res.length,
        payload: {
          query: res.query
        }
      };

    }
  },
  '/v1/artists/searches': {
    // Creates a search resource,
    // in other words, simply search artists
    post: async (ctx, next) => {
      ctx.status = 404;
    }
  },
  '/v1/artists/:id': {
//     get: async (ctx, next) => {
//       let res = Artist.findById(ctx.params.id);
//       if (res) {
//         res.body = {
//           status: ''
// }
}
    }
  },
  '/v1/artists/:id/albums': {
    get: async (ctx, next) => {

    }
  },
  '/v1/artists/:id/tracks': {
    get: async (ctx, next) {

    }
  }
}

export default routes;

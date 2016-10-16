
const routes = {

  '/v1/albums': {
    // returns a list of artists and their associated metadata
    get: async (ctx, next) => {

    }
  },
  '/v1/albums/searches': {
    // Creates a search resource,
    // in other words, simply search artists
    post: async (ctx, next) => {

    }
  },
  '/v1/albums/:id': {
    get: async (ctx, next) => {

    }
  },
  '/v1/albums/:id/tracks': {
    get: async (ctx, next) {

    }
  }
}

export default routes;

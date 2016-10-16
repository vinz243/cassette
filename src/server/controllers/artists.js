

const routes = {

  '/v1/artists': {
    // returns a list of artists and their associated metadata
    get: async (ctx, next) => {

    }
  },
  '/v1/artists/searches': {
    // Creates a search resource,
    // in other words, simply search artists
    post: async (ctx, next) => {

    }
  },
  '/v1/artists/:id': {
    get: async (ctx, next) => {

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

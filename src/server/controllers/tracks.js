
const routes = {

  '/v1/tracks': {
    // returns a list of artists and their associated metadata
    get: async (ctx, next) => {

    }
  },
  '/v1/tracks/:id': {
    get: async (ctx, next) => {

    },
    delete: async (ctx, next) => {

    }
  },
  '/v1/tracks/:id/files': {
    get: async (ctx, next) => {

    }
  },
  '/v1/tracks/:trackId/files/:fileId': {
    get: async (ctx, next) => {

    }
  },
  '/v1/tracks/:trackId/files/:fileId/media': {
    get: async (ctx, next) => {
      
    }
  }
}

export default routes;

import {Controller} from '../models/job';


const routes = {
  '/v1/libraries/:id/scans': {
    // This post will run a scan job.
    // This will run a scan on specified libraries
    // This returns an object like this:
    // {
    //   job_id: This is the job id to fetch results
    // }
    post: async (ctx, next) => {
      return;
    }
  },
  '/v1/libraries': {
    // Creates a new library
    // params:
    //   path: local path to libraries
    post: async (ctx, next) => {

    }
  },
  '/v1/libraries/:id': {
    // Fetch a library by id
    // Query:
    //   populate: 'artists', 'albums', 'tracks', or 'none' (default)
    // Returns:
    //   _id: lib id
    //   path: path to library
    //   [albums, artists, tracks]: [] (empty, unless populated)
    //   lastScan: Date
    //   name: lib name specified by user
    get: async (ctx) => {

    },
    // Deletes library
    // Params:
    //   unlink: bool also delete files from system
    delete: async (ctx) => {

    }
  },
  '/v1/libraries/:id/scan': {
    // Trigger a scan for specified library
    // Returns a job id
    // not restful
    post: async (ctx) => {

    }
  }
}

export default routes;

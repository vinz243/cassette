import search from './store';
import indexers from './indexers';
import downloaders from './downloaders';
import artworks from './artworks';
import jobs from './jobs';
import pkg from '../../../package.json';
import request from 'request-promise-native';
import semver from 'semver'

export default Object.assign({}, search, indexers, downloaders, artworks, jobs, {
  '/v1/updates': {
    get: async (ctx) => {
      let url = 'https://registry.npmjs.org/node-cassette';
      let json = await request.get(url);
      let data = JSON.parse(json);
      let latest = data['dist-tags'].latest;
      let current = pkg.version;
      if (semver.gt(latest, current)) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          data: [{
            version: data['dist-tags'].latest
          }]
        }
        return;
      }
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: []
      }
    },
    post: async (ctx) => {
      let url = process.argv[process.argv.length - 1];
      let res = await request.post(url + '/update');
      ctx.body = res;
    }
  },
  '/v1/restart': {
    post: async (ctx) => {
      let url = process.argv[process.argv.length - 1];
      let res = await request.post(url + '/restart');
      ctx.body = res;
    }
  },
  '/v1/update': {
    post: async (ctx) => {
      let url = process.argv[process.argv.length - 1];
      let res = await request.post(url + '/update');
      ctx.body = res;
      ctx.status = 201;
    }
  }
});

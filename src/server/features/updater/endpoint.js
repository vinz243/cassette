const request = require("request-promise-native");
const semver = require("semver")
const pkg = require("../../../../package.json");

module.exports = {
  '/v1/versions': {
    get: async (ctx) => {
      let url = 'https://registry.npmjs.org/node-cassette';
      let json = await request.get(url);
      let data = JSON.parse(json);
      let latest = data['dist-tags'].latest;
      let current = pkg.version;
      let versions = Object.keys(data['versions']).map(v => ({
        name: v,
        current: v === current,
        latest: v === latest,
        newer: semver.gt(v, current)
      }));

      ctx.status = 200;
      ctx.body = {
        success: true,
        status: 200,
        data: versions
      }
      return;
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
  },
};

const JobTorrent = require("./JobTorrent");

module.exports = {

  '/v1/jobs': {

    get: async (ctx) => {
      let res = await Promise.all(JobTorrent.find({}).map(j => j.getData()));
      ctx.body =  {
        success: true,
        data: res
      };
      ctx.status = 200;

    }
  }
}

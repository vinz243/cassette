const Artist = require('../models/Artist');
const Album  = require('../models/Album');
const Track  = require('../models/Track');
const File   = require('../models/File');

const {fetchable, oneToMany, updateable} = require('./Controller');

const merge = require("lodash/merge");
const fs    = require("fs");

module.exports = merge({},
  fetchable('track', Track.find, Track.findById),
  updateable('track', Track.findById),
  oneToMany('track', 'file', File.find), {
    '/api/v2/tracks/:id/stream':  {
      get: async (ctx, next) => {
        let tracks = await File.find({
          track: ctx.params.id - 0,
          sort: 'bitrate',
          direction: 'desc',
          limit: 3
        });
        if (tracks.length == 0)
          return ctx.throw(404, 'No file found');

        let stat = fs.statSync(tracks[0].props.path);
        let mimeType = 'audio/mpeg';

        if (tracks[0].props.path.endsWith('.flac')) {
          mimeType = 'audio/flac';
        }

        let opts = {}, code = 200;

        ctx.set('Content-Type', mimeType);
        ctx.set('Content-Length', stat.size);
        ctx.set('Accept-Ranges', 'bytes');

        if (ctx.headers['range']) {
          let [b, range] = ctx.headers['range'].split('=');

          if (b === 'bytes') {
            let [start, end] = range.split('-');

            if (!end || end === '' || end < start)
              end = stat.size - 1;

            opts = {
              start: start - 0,
              end: end - 0
            };

            code = 206;
            ctx.set('Content-Range',`bytes ${start}-${end}/${stat.size}`);
            ctx.set('Content-Length', end - start + 1);
          }
        }
        ctx.status = code;
        ctx.body = fs.createReadStream(tracks[0].data.path, opts);
      }
    }
  }
);

import {Artist, Album, Track, File} from '../models';
import Controller from './Controller';
import fs from 'fs';

const routes = new Controller(Track).done();

routes['/v1/tracks/:id/file'] = {
  get: async (ctx, next) => {
    let tracks = await File.find({
      trackId: ctx.params.id,
      sort: 'bitrate',
      direction: 'desc',
      limit: 3
    });
    if (tracks.length == 0)
      return res.writeHead(404, {});
    let stat = fs.statSync(tracks[0].data.path);
    let mimeType = 'audio/mpeg';

    if (tracks[0].data.path.endsWith('.flac')) {
      mimeType = 'audio/flac';
    }

    let opts = {}, res = 200;

    let resHeaders = {
      'Content-Type': mimeType,
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes'
    };
    // console.log(ctx.headers);
    // if (ctx.headers.accept !== '*/*') {
    //   ctx.res.writeHead(200, resHeaders);
    //   return;
    // }
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

        res = 206;
        resHeaders['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
        resHeaders['Content-Length'] = end - start + 1;
      }
    }

    ctx.res.writeHead(res, resHeaders);

    ctx.body = fs.createReadStream(tracks[0].data.path, opts);

    // readStream.pipe(ctx.res);
  }
}
export default routes;

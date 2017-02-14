import {find as findArtist,
        findById as findArtistById} from '../models/Artist';
import {find as findAlbum,
        findById as findAlbumById} from '../models/Album';
import {find as findTrack,
        findById as findTrackById} from '../models/Track';
import {find as findFile} from '../models/File';

import {fetchable, oneToMany, updateable} from './Controller';
import merge from 'lodash/merge';


export default merge({},
  fetchable('track', findTrack, findTrackById),
  updateable('track', findTrackById),
  oneToMany('track', 'file', findFile), {
    '/api/v2/tracks/:id/stream':  {
      get: async (ctx, next) => {
        let tracks = await findFile({
          track: ctx.params.id,
          sort: 'bitrate',
          direction: 'desc',
          limit: 3
        });
        if (tracks.length == 0)
          return ctx.throw(404, 'No file found');

        let stat = fs.statSync(tracks[0].data.path);
        let mimeType = 'audio/mpeg';

        if (tracks[0].data.path.endsWith('.flac')) {
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

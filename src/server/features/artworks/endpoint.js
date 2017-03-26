import {getClosestSize} from './sizes';
import {findById as findAlbumById} from '../../models/Album';
import {findById as findArtistById} from '../../models/Artist';

import config from '../../config.js';
import qs from 'querystring';
import mkdirp from 'mkdirp';
import path from 'path';
import request from 'request-promise-native';
import {mainStory} from 'storyboard';
import chalk from 'chalk';
import md5 from 'md5';
import fs from 'fs';
import sharp from 'sharp';

const dataDir = path.join(config.get('configPath'), 'artworks');

export default {
  '/api/v2/albums/:id/artwork': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      let filePath = '';
      if (ctx.params.id !== "undefined") {
        const album = await findAlbumById(ctx.params.id);

        if (!album) {
          console.log('NO ALBUM');
          return ctx.throw(404, 'Album not found');
        }
        // Generate unique cache per album
        const hash = md5(qs.stringify({
          entity: `album_artwork`,
          album: album.props.name
        }));
        filePath = path.join(dataDir, hash);
      } else {
        filePath = path.join(__dirname, '../../../../assets/no-album.jpg');
      }

      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '../../../../assets/no-album.jpg');
      }
      ctx.status = 200;
      ctx.body = await (new Promise((resolve, reject) => {
        const stat = fs.lstatSync(filePath);
        const image = stat.size > 20 ?
          filePath : path.join(__dirname, '../../../../assets/no-album.jpg');
        return fs.readFile(image, (err, data) => {
          if (err) {
            mainStory.error('artwork', `reading '${cachePath}' failed`, {attach: err});
            return reject(err);
          }
          resolve(sharp(data).resize(size - 0, size - 0).toBuffer());
        })
      }));
      ctx.set('Content-Type', 'image/png');
      return;
    }


  },
  '/api/v2/artists/:id/artwork': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      const artist = await findArtistById(ctx.params.id);

      if (!artist)
        return ctx.throw(404, 'Artist not found');

      // Generate unique cache per artist
      const hash = md5(qs.stringify({
        entity: `artist_artwork`,
        artist: artist.props.name
      }));

      let filePath = path.join(dataDir, hash);

      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '../../../../assets/no-artist.jpg');
      }

      if (fs.existsSync(filePath)) {
        ctx.body = await (new Promise((resolve, reject) => {
          const stat = fs.lstatSync(filePath);
          const image = stat.size > 20 ?
            filePath : path.join(__dirname, '../../assets/no-artist.jpg');
          return fs.readFile(image, (err, data) => {
            if (err) {
              mainStory.error('artwork', `reading '${cachePath}' failed`, {attach: err});
              return reject(err);
            }
            resolve(sharp(data).resize(size - 0, size - 0).toBuffer());
          })
        }));
        ctx.status = 200;
        ctx.set('Content-Type', 'image/png');
        return;
      }

    }
  }
}

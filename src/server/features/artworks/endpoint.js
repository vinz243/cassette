import {getClosestSize} from './sizes';
import {Album, Artist} from '../../models';
import config from '../../config.js';
import qs from 'querystring';
import mkdirp from 'mkdirp';
import path from 'path';
import request from 'request-promise-native';
import {mainStory} from 'storyboard';
import chalk from 'chalk';
import md5 from 'md5';
import fs from 'fs';

const dataDir = path.join(config.get('configPath'), '/cache/artworks');
mkdirp.sync(dataDir);

export default {
  '/v1/albums/:id/art': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      const album = await Album.findById(ctx.params.id);

      if (!album)
        return ctx.throw(404);

      const artist = await Artist.findById(album.data.artistId);

      let hash = md5(qs.stringify({
        action: 'get_album_art',
        size: size,
        id: album._id
      }));

      let cachePath = path.join(dataDir, hash);
      if (fs.existsSync(cachePath)) {
        ctx.body = await (new Promise((resolve, reject) => {
          return fs.readFile(cachePath, (err, data) => {
            if (err) {
              mainStory.error('artwork', `reading '${cachePath}' failed`, {attach: err});
              return reject(err);
            }
            resolve(data);
          })
        }));
        mainStory.info('artwork', 'sending cached album artwork');
        ctx.status = 200;
        ctx.set('Content-Type', 'image/png');
        return;
      }

      const params = {
        method: 'album.getinfo',
        api_key: '85d5b036c6aa02af4d7216af592e1eea',
        artist: artist.data.name,
        album: album.data.name,
        format: 'json'
      };

      const url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);
      const time = Date.now();
      let json = await request(url);
      mainStory.info('artwork', `GET ${chalk.dim(url)} - ${Date.now() - time}ms`);
      const data = JSON.parse(json);
      const availableSizes = data.album.image.map(s => s.size);

      if (availableSizes.length === 0) return ctx.throws(404);

      const target = getClosestSize(size, availableSizes);
      const imageUrl = data.album.image.find(el => el.size === target)['#text']
        || `http://lorempixel.com/g/${size}/${size}`;

      ctx.status = 200;
      ctx.set('Content-Type', 'image/png')
      let buffer = await request({
        url: imageUrl, encoding: null
      });
      mainStory.info('artwork', `GET ${chalk.dim(imageUrl)} - ${Date.now() - time}ms`);
      ctx.body = buffer;
      fs.writeFile(cachePath, buffer, (err) => {
        if (err) {
          return mainStory.error('artwork', `could not write to cache artwork (${cachePath})`, {
            attach: err
          });
        }
        return mainStory.info('artwork', 'cached artwork for next time');
      });
    }
  },
  '/v1/artists/:id/art': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      const artist = await Artist.findById(ctx.params.id);

      if (!artist)
        return ctx.throw(404);

      let hash = md5(qs.stringify({
        action: 'get_artist_art',
        size: size,
        id: artist._id
      }));

      let cachePath = path.join(dataDir, hash);
      if (fs.existsSync(cachePath)) {
        ctx.body = await (new Promise((resolve, reject) => {
          return fs.readFile(cachePath, (err, data) => {
            if (err) {
              mainStory.error('artwork', `reading '${cachePath}' failed`, {attach: err});
              return reject(err);
            }
            resolve(data);
          })
        }));
        mainStory.info('artwork', 'sending cached album artwork');
        ctx.status = 200;
        ctx.set('Content-Type', 'image/png');
        return;
      }
      const params = {
        method: 'artist.getinfo',
        api_key: '85d5b036c6aa02af4d7216af592e1eea',
        artist: artist.data.name,
        format: 'json'
      };

      const url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);
      const time = Date.now();
      let json = await request(url);

      mainStory.info('artwork', `GET ${chalk.dim(url)} - ${Date.now() - time}ms`);
      const data = JSON.parse(json);
      const availableSizes = data.artist.image.map(s => s.size);

      if (availableSizes.length === 0) return ctx.throws(404);

      const target = getClosestSize(size, availableSizes);
      const imageUrl = data.artist.image.find(el => el.size === target)['#text']
        || `http://lorempixel.com/g/${size}/${size}`;

      ctx.status = 200;
      ctx.set('Content-Type', 'image/png');

      const time2 = Date.now();
      let buffer = await request({
        url: imageUrl, encoding: null
      });
      mainStory.info('artwork', `GET ${chalk.dim(imageUrl)} - ${Date.now() - time2}ms`);
      ctx.body = buffer;
      fs.writeFile(cachePath, buffer, (err) => {
        if (err) {
          return mainStory.error('artwork', `could not write to cache artwork (${cachePath})`, {
            attach: err
          });
        }
        return mainStory.info('artwork', 'cached artwork for next time');
      });
    }
  }
}

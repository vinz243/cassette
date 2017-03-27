const {getClosestSize} = require('./sizes');

const Album  = require('../../models/Album');
const Artist = require('../../models/Artist');

const config     = require("../../config.js");
const qs        = require("querystring");
const mkdirp    = require("mkdirp");
const path      = require("path");
const request   = require("request-promise-native");
const mainStory = require('storyboard').mainStory;
const chalk     = require("chalk");
const md5       = require("md5");
const fs        = require("fs");
const sharp     = require("sharp");

const dataDir = path.join(config.get('configPath'), 'artworks');

module.exports = {
  '/api/v2/albums/:id/artwork': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      let filePath = '';
      if (ctx.params.id !== "undefined") {
        const album = await Album.findById(ctx.params.id);

        if (!album) {
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
      const artist = await Artist.findById(ctx.params.id);

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

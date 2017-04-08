const Torrent     = require('features/store/models/torrent');
const WantedAlbum = require('features/store/models/wanted-album');

const {fetchable, oneToMany, updateable, createable} = require('controllers/Controller');
const merge   = require("lodash/merge");

module.exports = merge({},
  fetchable('wanted-album', WantedAlbum.find, WantedAlbum.findById),
  createable('wanted-album', WantedAlbum),
  oneToMany('wanted-album', 'results', Torrent.find, 'wanted_album'), {
    '/api/v2/wanted-albums/:id/searches':  {
      post: async (ctx, next) => {
        const album = await WantedAlbum.findById(ctx.params.id);
        if (!album) {
          return ctx.throw(404, 'WantedAlbum not found');
        }

        album.download();
        ctx.status = 201;
        ctx.body = album.props;
      }
    }
  }
);

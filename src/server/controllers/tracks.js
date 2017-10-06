const Artist = require('../models/Artist');
const Album  = require('../models/Album');
const Track  = require('../models/Track');
const File   = require('../models/File');

const {fetchable, oneToMany, updateable} = require('./Controller');

const merge = require("lodash/merge");
const fs    = require("fs");
const jwt   = require('jwt');

module.exports = merge({},
  fetchable('track', Track.find, Track.findById),
  updateable('track', Track.findById),
  oneToMany('track', 'file', File.find), {
    '/api/v2/tracks/:id/stream':  {
      post: async (ctx, next) => {
        let tracks = await File.find({
          track: ctx.params.id - 0,
          sort: 'bitrate',
          direction: 'desc',
          limit: 3
        });

        ctx.body = {
          stream_token: jwt.create({
            tr_id: tracks[0].props._id
          }, {
            expiresIn: '15m'
          })
        }
        ctx.status = 201;
      }
    }
  }
);

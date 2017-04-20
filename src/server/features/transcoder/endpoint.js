const Transcode = require('./transcode');
const File      = require('models/File');
const shortid   = require('shortid');

const transcodes = {};

module.exports = {
  '/api/v2/transcodes': {
    // body:
    //   file:         the file id (required, unless track specified)
    //   track:       track id (optional)
    //   format:      format, either 'flac' or 'mp3'. default is 'mp3'
    //   codec:       mp3 codec, either 'vbr' or 'cbr'. default is 'vbr',
    //   quality:     VBR quality, default to 0
    //   chunkLength: chunk length in seconds
    //   fadeIn:      fade duration in ms at the beginning of the audio
    //   fadeout:     fade duration in ms at the end of the audio
    post: async function (ctx) {
      console.log(ctx.request.body);
      const {format, codec, quality, chunkLength, fadeIn, fadeOut} = ctx.request.body;
      const params = {format, codec, quality, chunkLength, fadeIn, fadeOut};

      if (ctx.request.body.file) {
        const file = File.findById(ctx.request.body.file);
        const {path} = file.props;
        const id = shortid.generate();
        const transcode = transcodes[id] = new Transcode(Object.assign({}, {
          source: path
        }, params));
        await transcode.probe();
        ctx.status = 201;
        ctx.body = Object.assign({}, transcode.props, {_id: id});
      } else {
        if (ctx.request.body.track) {
          const [file] = await File.find({
            track: +ctx.request.body.track,
            sort: 'bitrate',
            direction: 'desc',
            limit: 3
          });
          if (!file)
            return ctx.throw(404, 'No file found');

          const {path} = file.props;
          const id = shortid.generate();
          const transcode = transcodes[id] = new Transcode(Object.assign({}, {
            source: path
          }, params));
          await transcode.probe();
          ctx.status = 201;
          ctx.body = Object.assign({}, transcode.props, {_id: id});
          return;
        } else {
          return ctx.throw(402, 'No source specified');
        }
      }
    }
  },
  '/api/v2/transcodes/:id/chunks': {
    get: function (ctx) {

    }
  },
  '/api/v2/transcodes/:id/chunks/:chunk': {
    get: function (ctx) {
      const mimeType = 'audio/mpeg';

      console.log(ctx.req.header('Accept-Encoding'));
      if (ctx.req.header('Accept-Encoding') === 'identity;q=1, *;q=0') {
        ctx.respond = false;
        ctx.res.writeHead(200, {
          'Content-Type': mimeType,
          'Transfer-Encoding': 'chunked',
          'Connection': 'close',
          'Accept-Ranges': 'none'
        });
        transcodes[ctx.params.id]
          .transcodeChunk(+ctx.params.chunk, ctx.res);
      } else {
        ctx.set('Content-Type', mimeType);
        ctx.set('Transfer-Encoding', 'chunked');
        ctx.set('Connection', 'close');
        ctx.set('Accept-Ranges', 'none');

        ctx.body = new Buffer([]);
        ctx.status = 200;
      }
    }
  }
}

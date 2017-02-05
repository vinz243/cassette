import {getClosestSize} from './sizes';
import {Album, Artist} from '../../models';
import qs from 'querystring';
import request from 'request-promise-native';
export default {
  '/v1/albums/:id/art': {
    get: async (ctx) => {
      const {size = 300} = ctx.request.query;
      const album = await Album.findById(ctx.params.id);
      if (!album) {
        console.log('No album');
        return ctx.throw(404);
      }
      const params = {
        method: 'album.getinfo',
        api_key: '85d5b036c6aa02af4d7216af592e1eea',
        artist: (await Artist.findById(album.data.artistId)).data.name,
        album: album.data.name,
        format: 'json'
      };
      
      const url = 'http://ws.audioscrobbler.com/2.0/?' + qs.stringify(params);

      let json = await request(url);
      const data = JSON.parse(json);
      const availableSizes = data.album.image.map(s => s.size);

      if (availableSizes.length === 0) return ctx.throws(404);

      const target = getClosestSize(size, availableSizes);
      const imageUrl = data.album.image.find(el => el.size === target)['#text'];

      ctx.status = 200;
      ctx.set('Content-Type', 'image/png')
      ctx.body = await request({
        url: imageUrl, encoding: null
      });

    }
  }
}

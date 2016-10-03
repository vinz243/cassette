import config from '../models/config';


let routes = {
  '/v1/config/:key':  {
    get: async function (next) {
      let value = await config.get(this.params.key);
      this.body = {
        key: this.params.key,
        value: value
      };
      return;
    }
  }
}

const GAPI = require('./lib/server/features/indexers/GazelleAPI.js');
let api = new GAPI.default();

api.login().then(() => {
  return api.searchTorrents('Led Zeppelin IV');
}).then((d) => {
  console.log(JSON.stringify(d));
}).catch(console.log);

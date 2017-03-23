import albumsController from './controllers/albums';
import artistsController from './controllers/artists';
// import configController from './controllers/config';
import librariesController from './controllers/libraries';
import tracksController from './controllers/tracks';
import scansController from './controllers/scans';
// import filesController from './controllers/files';
import features from './features';
// import jobController from './controllers/job';

let routes = {};

Object.assign(routes,
  artistsController,
  albumsController,
  tracksController,
  librariesController,
  scansController);
  
Object.assign(routes, features)

export default function (router) {
  for(let route in routes) {
    for(let verb in routes[route]) {
      // console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
}

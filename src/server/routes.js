import albumsController from './controllers/albums';
import artistsController from './controllers/artists';
import configController from './controllers/config';
import librariesController from './controllers/libraries';
// import jobController from './controllers/job';

let routes = {};

Object.assign(routes, configController);
// Object.assign(routes, jobController);
Object.assign(routes, artistsController);
Object.assign(routes, albumsController);
Object.assign(routes, librariesController);

export default function (router) {
  for(let route in routes) {
    for(let verb in routes[route]) {
      // console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
}

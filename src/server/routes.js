import configController from './controllers/config';
import jobController from './controllers/job';
let routes = {};

Object.assign(routes, configController);
Object.assign(routes, jobController);

export default function (router) {
  for(let route in routes) {
    for(let verb in routes[route]) {
      // console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
}

import configController from './controllers/config';

let routes = {};

Object.assign(routes, configController);

export default function (router) {
  for(let route in routes) {
    for(let verb in routes[route]) {
      console.log(verb, route);
      router[verb](route, routes[route][verb]);
    }
  }
}

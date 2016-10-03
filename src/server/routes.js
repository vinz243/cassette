import configController from 'controllers/config';

let routes = [...configController];

export default function (router) {
  for(let route in routes) {
    for(let verb in routes[route]) {
      router[verb](route, routes[route][verb]);
    }
  }
}

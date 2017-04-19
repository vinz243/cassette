import axios from 'axios';
import socket from 'app/socket';

const request = function (method, url, config = {}, additionalConfig = {}) {
  if (['post', 'put', 'patch'].includes(method)) {
    config = Object.assign({}, ((old) => ({data: old}))(config), additionalConfig);
  }
  const token = localStorage.getItem('sessionToken');

  if (typeof url === 'object') {
    config = url;
    url = config.url;
  }

  if (!token && !(
    url.startsWith('/api/v2/checks') || url === '/api/v2/configure'
    || url === '/api/v2/status'
  )) {
    throw new Error('Please login before accessing protected endpoint');
  }
  const params = {
    ...config, method, url,
    headers: Object.assign({}, (config.headers || {}), token ? {
      Authorization: `Bearer ${token}`
    } : {})
  };
  return axios(params);
}

export default {
  login: async function ({username, password}) {
    const {data} = await axios.post('/api/v2/sessions', {username, password});
    localStorage.setItem('sessionToken', data.token);
    socket.authenticate();
    return;
  },
  get: request.bind(null, 'get'),
  post: request.bind(null, 'post'),
  put: request.bind(null, 'put')
}

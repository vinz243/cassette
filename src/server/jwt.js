const config = require('config');
const jsonwebtoken = require('jsonwebtoken');

module.exports = {
  create: (payload, options = {}) => {
    return jsonwebtoken.sign(payload, config.get('jwtSecret'), options);
  },
  read: (token, options = {}) => {
    return jsonwebtoken.verify(token, config.get('jwtSecret'), options);
  }
}

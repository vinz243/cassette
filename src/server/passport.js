const passport       = require('koa-passport');
const LocalStrategy  = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const model          = require('models/Model');
const password       = require('password-hash-and-salt');
const jwt            = require('jsonwebtoken');
const config          = require('config');
const db             = model.getDatabase('users');

passport.use(new LocalStrategy(
  function(username, pass, done) {
    db.findOne({ username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: 'Incorrect username or password.'});
      }
      password(pass).verifyAgainst(user.hash, (err, verified) => {
        if (!verified) {
          return done(null, false, {message: 'Incorrect username or password.'});
        }
        return done(null, user);
      })
    });
  }
));

passport.use(new CustomStrategy(
  function(req, done) {
    const auth = req.header.authorization;
    if (!auth) {
      return done(new Error('No bearer provided'));
    }
    const [bearer, token] = auth.split(' ');
    try {
      const user = jwt.verify(token, config.get('jwtSecret'));
      return done(null, user)
    } catch (err) {
      return done(err);
    }
  }
));


module.exports = passport;

module.exports.addUser = function (username, pass) {
  return new Promise(function (resolve, reject) {
    password(pass).hash(function (err, hash) {
      if (err) {
        return reject(err);
      }
      const user = {
        username,
        hash
      };

      db.insert(user, function (err, doc) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    })
  })
}

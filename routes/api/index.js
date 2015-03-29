var passport = require('passport')
  , express = require('express')
  , users = require('./users')
  , clients = require('./clients')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , db = require('./../../db')

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(function(accessToken, done) {
  db.accessTokens.find(accessToken, function(err, token) {
    if (err) { return done(err); }
    if (!token) { return done(null, false); }

    if (token.userID != null) {
      db.users.find(token.userID, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        var info = { scope: '*' }
        done(null, user, info);
      });
    } else {
      //The request came from a client only since userID is null
      //therefore the client is passed back instead of a user
      db.clients.findByClientId(token.clientID, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        var info = { scope: '*' }
        done(null, client, info);
      });
    }
  });
}));

module.exports = function() {
  var router = express.Router();
  router.use(passport.authenticate('bearer', { session: false })); // on every request to API
  router.use('/users', users);
  router.use('/clients', clients);
  return router;
};

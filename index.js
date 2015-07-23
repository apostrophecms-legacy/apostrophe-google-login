module.exports = factory;

function factory(options, callback) {
  return new Construct(options, callback);
}

function Construct(options, callback) {
  var self = this;
  var apos = options.apos;
  var app = options.app;
  var passport = options.passport;

  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  passport.use(new GoogleStrategy({
    clientID: options.id,
    clientSecret: options.secret,
    callbackURL: options.baseUrl + "/apos-google-login/return"
  }, function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    return apos.pages.findOne({ email: email, type: 'person', login: true, trash: { $ne: true } }, function(err, person){
      if (err) {
        return done(err);
      }
      else if (!person) {
        return done(null, false);
      }
      return done(null, { _id : person._id, _mongodb : true });
    });
  }));

  app.get('/apos-google-login',
    passport.authenticate('google', {scope : 'openid email'})
  );

  app.get('/apos-google-login/return',
    passport.authenticate('google', { failureRedirect: options.failureRedirect }),
    function(req, res) {
      // Successful authentication redirect
      res.redirect(options.afterLogin || '/');
  });

  // Invoke the callback. This must happen on next tick or later!
  return process.nextTick(function() {
    return callback(null);
  });
}

// Export the constructor so others can subclass
factory.Construct = Construct;

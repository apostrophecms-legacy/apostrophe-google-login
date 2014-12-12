# apostrophe-google-login

This module allows users to log into your [Apostrophe site](http://apostrophenow.org) via their Google account, as an optional alternative to using their password.

There must be an existing user on the site with the same email address as the Google account.

## Installation

This module also requires that you install the `passport` module globally, so that we can be sure the same instance of `passport` is seen by both Apostrophe's standard login and `apostrophe-google-login`.

```
npm install --save apostrophe-google-login
npm install --save passport
```

## Configuration

First, you must require `passport` in `app.js`:

```javascript
var passport = require('passport');
```

Second, you must pass `passport` to `apostrophe-site`:

```javascript
var site = require('apostrophe-site')({
  passport: passport,
  // ... The rest of your site's configuration ...
});
```

Third, you must configure the `apostrophe-google-login` module, along with theother modules of your project:

```javascript
  modules: {
    "apostrophe-google-login": {

      // Use the Google Developers Console to obtain these for
      // YOUR project:
      // https://console.developers.google.com/project

      id: 'GOOGLE_CLIENT_ID',
      secret: 'GOOGLE_CLIENT_SECRET',

      // Make sure you pass in passport
      passport: passport,

      // This will probably be http://localhost:3000 during development.
      // It must be the base URL of your site as seen in the browser
      baseUrl: 'http://example.com',

      // Where to redirect the user if Google login fails, or they
      // have a gmail account but it is not associated with your site.
      // Sending them to your login page is a good choice. You might
      // override it with a suitable error message in this case.
      failureRedirect: '/login?query=googleFailure=1'
    },
    // ... other modules ...
  }
```

Note: you may want to use `data/local.js` to merge different settings on your production server, so you can continue to test gmail login in development as well. That looks like this:

```javascript
// In data/local.js
module.exports = {
  // Other settings, then...
  modules: {
    'apostrophe-google-login': {
      id: 'myid',
      secret: 'mysecret',
      baseUrl: 'http://my.production.site.com'
    }
  }
};
```

## Usage

To log a user in via Google, just make a link to `/apos-google-login` on your site.

That's all there is to it! The user will be asked to give permission the first time. After that the link works immediately.

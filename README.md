# passport-eipsk-strategy

[![Build Status](https://api.travis-ci.org/dvpnt/passport-eipsk-strategy.svg)](https://travis-ci.org/dvpnt/passport-eipsk-strategy)
[![Coverage Status](https://coveralls.io/repos/github/dvpnt/passport-eipsk-strategy/badge.svg?branch=master)](https://coveralls.io/github/dvpnt/passport-eipsk-strategy?branch=master)
[![NPM Version](https://img.shields.io/npm/v/passport-eipsk-strategy.svg)](https://www.npmjs.com/package/passport-eipsk-strategy)

[Passport](http://passportjs.org/) strategy for authenticating with [EIPSK](https://all.culture.ru)
using the OAuth 2.0 API.

## Install
    $ npm i passport-eipsk-strategy

## Usage

#### Configure Strategy

```js
var passport = require('passport'),
    EipskStrategy = require('passport-eipsk-strategy').Strategy;

passport.use(new EipskStrategy({
    clientID: '<app id>',
    clientSecret: '<secret key>',
    callbackURL: 'http://localhost:3000/auth/eipsk/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({eipskId: profile.id}, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eipsk'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/eipsk',
  passport.authenticate('eipsk'));

app.get('/auth/eipsk/callback',
  passport.authenticate('eipsk', {failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## License

[The MIT License](https://raw.githubusercontent.com/dvpnt/passport-eipsk-strategy/master/LICENSE)

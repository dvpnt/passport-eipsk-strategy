# passport-eipsk-strategy

TODO: add badges

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
app.get('/auth/odnoklassniki',
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

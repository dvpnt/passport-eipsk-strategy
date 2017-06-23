'use strict';

var OAuth2Strategy = require('passport-oauth2'),
	InternalOAuthError = require('passport-oauth2').InternalOAuthError,
	util = require('util'),
	url = require('url'),
	profile = require('./profile'),
	errors = require('./errors');

/**
 * `Strategy` constructor.
 *
 * The EIPSK authentication strategy authenticates requests by delegating to
 * EIPSK using the OAuth 2.0 protocol.
 *
 * Options:
 *   - `clientID`      Application Id
 *   - `clientSecret`  Application secret key
 *   - `clientPublic`  Application public key
 *   - `callbackURL`   URL to which EIPSK will redirect the user after granting authorization
 *   - `profileURL`    Url to retrieve profile information
 *   - `profileFields` Fields that should be retrieved from EIPSK
 *
 * Examples:
 *
 *     passport.use(new EipskStrategy({
 *         clientID: '213dsal',
 *         clientSecret: 'private-key'
 *         clientPublic: 'public-key'
 *         callbackURL: 'https://www.example.net/oauth/eipsk/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
var Strategy = function(options, verify) {
	options.authorizationURL = options.authorizationURL ||
		'https://all.culture.ru/oauth/authorize';
	options.tokenURL = options.tokenURL ||
		'https://all.culture.ru/oauth/token';
	options.scopeSeparator = options.scopeSeparator || ';';

	OAuth2Strategy.call(this, options, verify);

	this.name = 'eipsk';

	this._profileURL = options.profileURL || 'https://all.culture.ru/api/2.3/users/me';
	this._profileFields = options.profileFields;
};

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from EIPSK.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `eipsk`
 *   - `id`               the user's _id
 *   - `displayName`      the user's fullName
 *   - `name.familyName`  the user's lastName
 *   - `name.givenName`   the user's firstName
 *   - `gender`           the user's gender: `male` or `female`
 *   - `profileUrl`       the URL of the profile for the user on EIPSK
 *   - `emails`           the proxied or contact email address granted by the user
 *   - `photos`           the list of all pics in EIPSK (empty)
 *
 * @param {string} accessToken
 * @param {function} done
 * @access public
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	var profileURL = url.parse(this._profileURL),
		profileFields = this._profileFields && this._profileFields.join(','),
		params = {
			fields: 'firstName,lastName,fullName,email,gender,phones'
		};

	if (profileFields) {
		params.fields = profileFields;
	}

	profileURL.query = params;

	this._oauth2.get(url.format(profileURL), accessToken, function(err, body) {
		if (err) {
			return done(new InternalOAuthError('Failed to fetch user profile', err));
		}

		try {
			var json = JSON.parse(body);
		} catch (e) {
			return done(new errors.InvalidResponse());
		}

		if (json.error) {
			return done(new errors.EipskApiError(json));
		}

		var resultProfile = profile.parse(json);

		resultProfile.provider = 'eipsk';
		resultProfile._raw = body;
		resultProfile._json = json;

		done(null, resultProfile);
	});
};

module.exports = Strategy;


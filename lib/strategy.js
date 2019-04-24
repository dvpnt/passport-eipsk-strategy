'use strict';

var BaseStrategy = require('passport-dvpnt-oauth2-strategy').Strategy;
var util = require('util');


function Strategy(options, verify) {
	options.authorizationURL = options.authorizationURL ||
		'https://all.culture.ru/auth/oauth2/authorize';
	options.tokenURL = options.tokenURL ||
		'https://all.culture.ru/auth/oauth2/token';

	BaseStrategy.call(this, options, verify);

	this.name = 'eipsk';
	this._profileURL = options.profileURL || 'https://all.culture.ru/auth/api/1.0/user';
}

util.inherits(Strategy, BaseStrategy);

Strategy.prototype.parseProfile = function(json) {
	var user = json.user;
	var profile = {};

	profile.id = user._id;
	profile.displayName = user.firstName + ' ' + user.lastName;
	profile.name = {
		familyName: user.lastName,
		givenName: user.firstName
	};

	profile.gender = user.gender;
	profile.profileUrl = 'https://all.culture.ru/cabinet/users/' + profile.id;

	profile.emails = [{value: user.email}];

	profile.photos = [];

	return profile;
};

module.exports = Strategy;

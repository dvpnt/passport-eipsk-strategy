'use strict';

/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function profileParser(json) {
	var user = json.user,
		profile = {};

	profile.id = user._id;
	profile.displayName = user.firstName + ' ' + user.lastName;
	profile.name = {
		familyName: user.lastName,
		givenName: user.firstName
	};

	profile.gender = user.gender;
	profile.profileUrl = 'https://all.culture.ru/cabinet/users/' + profile.id;
	profile.emails = [user.email];

	profile.photos = [];

	return profile;
};


'use strict';

/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function profileParser(json) {
	var profile = {};

	profile.id = json._id;
	profile.displayName = json.fullName;
	profile.name = {
		familyName: json.lastName,
		givenName: json.firstName
	};

	profile.gender = json.gender;
	profile.profileUrl = 'https://all.culture.ru/cabinet/users/' + profile.id;
	profile.emails = [json.email];

	profile.photos = [];

	return profile;
};


'use strict';

var Strategy = require('../lib').Strategy;
var expect = require('expect.js');

describe('Strategy', function() {
	it('check profile parsing', function() {
		var strategy = new Strategy({
			clientID: '1234',
			clientPublic: '1234',
			clientSecret: '123abcf3213'
		}, function() {});

		var user = {
			_id: 1,
			firstName: 'Петр',
			gender: 'male',
			lastName: 'Петров',
			email: 'example@mail.ru'
		};

		var profile = strategy.parseProfile({user: user});

		expect(profile.id).to.eql(user._id);
		expect(profile.displayName).to.eql(user.firstName + ' ' + user.lastName);
		expect(profile.name.familyName).to.eql(user.lastName);
		expect(profile.name.givenName).to.eql(user.firstName);
		expect(profile.gender).to.eql(user.gender);
		expect(profile.profileUrl)
			.to.eql('https://all.culture.ru/cabinet/users/' + user._id);
		expect(profile.photos).to.have.length(0);
		expect(profile.emails).to.have.length(1);
		expect(profile.emails).to.eql([{value: user.email}]);
	});
});

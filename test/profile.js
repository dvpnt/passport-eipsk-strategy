'use strict';

var sinon = require('sinon'),
	InternalOAuthError = require('passport-oauth2').InternalOAuthError,
	url = require('url'),
	expect = require('expect.js'),
	errors = require('../lib/errors'),
	helpers = require('./helpers');

describe('Profile', function() {
	describe('getting', function() {
		var strategy, stub, getStub,
			clientSecret = '1234',
			accessToken = 'accesstoken';

		before(function() {
			strategy = helpers.createStrategy({
				clientSecret: clientSecret
			});
			helpers.passport.use(strategy);
		});

		after(function() {
			helpers.passport.restore();
		});

		beforeEach(function() {
			stub = sinon.stub();
			getStub = sinon.stub(strategy._oauth2, 'get');
		});

		afterEach(function() {
			getStub.restore();
		});

		it('check oauth url', function() {
			strategy.userProfile(accessToken, stub);

			expect(getStub.called).to.be.ok();
			var call = getStub.firstCall;
			expect(call.args[1]).to.eql(accessToken);

			var parsedUrl = url.parse(call.args[0], true);
			expect(parsedUrl.host).to.eql('all.culture.ru');
			expect(parsedUrl.pathname).to.eql('/api/2.3/users/me');
		});

		it('try to get with oauth error', function() {
			var errorData = {
				statusCode: 500,
				data: {}
			};

			getStub.yields(errorData);

			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.a(InternalOAuthError);
			expect(error.message).to.eql('Failed to fetch user profile');
			expect(error.oauthError).to.eql(errorData);
		});

		it('try to get with invalid json', function() {
			getStub.yields(null, 'invalidjson');

			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.an(errors.InvalidResponse);
		});

		it('check eipsk api error', function() {
			var errorData = {
				error: 'test error'
			};

			getStub.yields(null, JSON.stringify(errorData));
			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.an(errors.EipskApiError);
			expect(error.message).to.eql(errorData.error);
		});

		it('check profile parsing', function() {
			var profileData = {
					_id: 1,
					email: "ivan@example.com",
					firstName: "Петр",
					fullName: "Петр Петров",
					gender: "male",
					lastName: "Петров"
				},
				rawProfile = JSON.stringify(profileData);

			getStub.yields(null, rawProfile);
			strategy.userProfile(accessToken, stub);

			expect(stub.firstCall.args[0]).to.not.be.ok();

			var profile = stub.firstCall.args[1];
			expect(rawProfile).to.eql(profile._raw);
			expect(profileData).to.eql(profile._json);

			expect(profile.provider).to.eql('eipsk');

			expect(profile.id).to.eql(profileData._id);
			expect(profile.displayName).to.eql(profileData.fullName);
			expect(profile.name.familyName).to.eql(profileData.lastName);
			expect(profile.name.givenName).to.eql(profileData.firstName);
			expect(profile.gender).to.eql(profileData.gender);
			expect(profile.profileUrl)
				.to.eql('https://all.culture.ru/cabinet/users/' + profile.id);
			expect(profile.emails).to.have.length(1);
			expect(profile.emails[0]).to.eql(profileData.email);

			expect(profile.photos).to.have.length(0);
		});
	});

	describe('getting with fields', function() {
		var strategy,
			fields = ['first_name', 'last_name'];

		before(function() {
			strategy = helpers.createStrategy({
				profileFields: fields
			});
			helpers.passport.use(strategy);
		});

		after(function() {
			helpers.passport.restore();
		});

		it('check that fields in url', function() {
			var stub = sinon.stub(),
				getStub = sinon.stub(strategy._oauth2, 'get');

			strategy.userProfile('1234', stub);

			expect(getStub.called).to.be.ok();
			var call = getStub.firstCall;

			var parsedUrl = url.parse(call.args[0], true);
			expect(parsedUrl.query.fields).to.be.ok();
			expect(parsedUrl.query.fields).to.eql(fields.join(','));
		});
	});
});


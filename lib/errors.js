'use strict';

var util = require('util');

exports.EipskApiError = EipskApiError;

function EipskApiError(params) {
	this.message = params.error;
}

util.inherits(EipskApiError, Error);

exports.InvalidResponse = InvalidResponse;

function InvalidResponse() {
	this.message = 'Can\'t parse reponse data';
}

util.inherits(InvalidResponse, Error);


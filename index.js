'use strict';
const url = require('url');
const punycode = require('punycode');
const queryString = require('query-string');
const prependHttp = require('prepend-http');
const sortKeys = require('sort-keys');

const DEFAULT_PORTS = {
	'http:': 80,
	'https:': 443,
	'ftp:': 21
};

module.exports = (str, opts) => {
	const {stripWWW} = opts || {};
	const hasRelativeProtocol = str.startsWith('//');

	// Prepend protocol
	str = prependHttp(str.trim()).replace(/^\/\//, 'http://');

	const urlObj = url.parse(str);

	if (!urlObj.hostname && !urlObj.pathname) {
		throw new Error('Invalid URL');
	}

	// Prevent these from being used by `url.format`
	delete urlObj.host;
	delete urlObj.query;


	if (urlObj.hostname) {
		// IDN to Unicode
		urlObj.hostname = punycode.toUnicode(urlObj.hostname).toLowerCase();

		// Remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (stripWWW) {
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	return urlObj.hostname;
};

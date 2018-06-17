const fetch = require('node-fetch').default;
const jwt = require('jsonwebtoken');

module.exports = class KeyManager {
	constructor() {
		this.key_cache = {};
	}

	async getKey({key_id, aws_region, userpool_id}) {
		let keys_url = `https://cognito-idp.${aws_region}.amazonaws.com/${userpool_id}/.well-known/jwks.json`;
		return this.key_cache[key_id] || this.fetchAndCacheKey({key_id, keys_url});;
	}

	async fetchAndCacheKey({key_id, keys_url}) {
		let keys = await fetch(keys_url).then(res => res.json()).then(json => json.keys);
		let found_jwk = keys.find(key => key.kid === key_id);
		if (found_jwk) {
			this.key_cache[key_id] = found_jwk;
			return found_jwk;
		} else {
			throw 'Key ID not found at the provided URL.'
		}
	}

}

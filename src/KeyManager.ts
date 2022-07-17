import fetch from "node-fetch";

export interface GetKeyParams {
	key_id: string;
	aws_region: string;
	userpool_id: string;
}
export interface FetchAndCacheKeyParams {
	key_id: string;
	keys_url: string;
}

export default class KeyManager {
	public key_cache: any;

	constructor() {
		this.key_cache = {};
	}

	async getKey({ key_id, aws_region, userpool_id }: GetKeyParams) {
		const keys_url = `https://cognito-idp.${aws_region}.amazonaws.com/${userpool_id}/.well-known/jwks.json`;
		return (
			this.key_cache[key_id] || this.fetchAndCacheKey({ key_id, keys_url })
		);
	}

	async fetchAndCacheKey({ key_id, keys_url }: FetchAndCacheKeyParams) {
		const keys = await fetch(keys_url)
			.then((res) => res.json())
			.then((json: any) => json.keys);
		const found_jwk = keys.find((key: any) => key.kid === key_id);
		if (found_jwk) {
			this.key_cache[key_id] = found_jwk;
			return found_jwk;
		} else {
			throw "Key ID not found at the provided URL.";
		}
	}
}

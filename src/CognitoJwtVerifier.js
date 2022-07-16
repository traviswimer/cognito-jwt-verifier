const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const KeyManager = require("./KeyManager");

const required_params = [
	"token",
	"aws_region",
	"userpool_id",
	"userpool_client_id",
];

module.exports = class CognitoJwtVerifier {
	constructor() {
		this.key_manager = new KeyManager();
	}

	async verifyToken(params) {
		// Make sure require params are included
		required_params.forEach((param) => {
			if (typeof params[param] === "undefined") {
				throw `"${param}" parameter is required.`;
			}
		});
		let { token, aws_region, userpool_id, userpool_client_id } = params;

		// 1. Checks that the token signature is valid
		let decoded_jwt = await this.ensureTokenIsValid({
			token,
			aws_region,
			userpool_id,
		});

		// 2. Make sure the token has not expired
		this.ensureTokenIsNotExpired(decoded_jwt.exp);

		// 3. Ensure that this token is for the correct userpool client
		this.ensureUserpoolClientIdsMatch({ decoded_jwt, userpool_client_id });

		return decoded_jwt;
	}

	async ensureTokenIsValid({ token, aws_region, userpool_id }) {
		// Get the key ID from the token header
		let jwt_header = jwt.decode(token, { complete: true }).header || {};
		let key_id = jwt_header.kid;

		// Retrieve the jwk from the cache if it exists.
		// Otherwise retrieve it from the AWS URL.
		let jwk = await this.key_manager.getKey({
			key_id,
			aws_region,
			userpool_id,
		});

		// Convert the JWK to PEM so it can be verified/decoded
		let pem = jwkToPem(jwk);
		return jwt.verify(token, pem);
	}

	ensureTokenIsNotExpired(token_expiration_timestamp) {
		let current_timestamp_in_seconds = Math.floor(Date.now() / 1000);
		if (current_timestamp_in_seconds > token_expiration_timestamp) {
			throw "JWT token has expired.";
		}
	}

	ensureUserpoolClientIdsMatch({ decoded_jwt, userpool_client_id }) {
		if (decoded_jwt.aud !== userpool_client_id) {
			throw `JWT's "aud" property does not match the userpool client id`;
		}
	}
};

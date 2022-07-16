import jwt, { JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import KeyManager from "./KeyManager";

export interface VerifyTokenParams {
	token: string;
	aws_region: string;
	userpool_id: string;
	userpool_client_id: string;
}
export type VerifyTokenParamKey = keyof VerifyTokenParams;

export interface EnsureTokenIsValidParams {
	token: string;
	aws_region: string;
	userpool_id: string;
}

export interface EnsureUserpoolClientIdsMatchParams {
	decoded_jwt: JwtPayload;
	userpool_client_id: string;
}

const required_params: VerifyTokenParamKey[] = [
	"token",
	"aws_region",
	"userpool_id",
	"userpool_client_id",
];

export default class CognitoJwtVerifier {
	private key_manager: KeyManager;

	constructor() {
		this.key_manager = new KeyManager();
	}

	async verifyToken(params: VerifyTokenParams) {
		// Make sure require params are included
		required_params.forEach((param) => {
			if (typeof params[param] === "undefined" || params[param] === null) {
				throw `"${param}" parameter is required.`;
			}
		});
		const { token, aws_region, userpool_id, userpool_client_id } = params;

		// 1. Checks that the token signature is valid
		const decoded_jwt = await this.ensureTokenIsValid({
			token,
			aws_region,
			userpool_id,
		});
		if (typeof decoded_jwt === "string") {
			throw `Error validating token`;
		}

		// 2. Make sure the token has not expired
		this.ensureTokenIsNotExpired(decoded_jwt.exp);

		// 3. Ensure that this token is for the correct userpool client
		this.ensureUserpoolClientIdsMatch({ decoded_jwt, userpool_client_id });

		return decoded_jwt;
	}

	async ensureTokenIsValid({
		token,
		aws_region,
		userpool_id,
	}: EnsureTokenIsValidParams) {
		// Get the key ID from the token header
		const jwt_header = jwt.decode(token, { complete: true })?.header;
		const key_id = jwt_header?.kid;
		if (typeof key_id !== "string") {
			throw `Invalid token key ID`;
		}

		// Retrieve the jwk from the cache if it exists.
		// Otherwise retrieve it from the AWS URL.
		const jwk = await this.key_manager.getKey({
			key_id,
			aws_region,
			userpool_id,
		});

		// Convert the JWK to PEM so it can be verified/decoded
		const pem = jwkToPem(jwk);
		return jwt.verify(token, pem);
	}

	ensureTokenIsNotExpired(token_expiration_timestamp?: number) {
		const current_timestamp_in_seconds = Math.floor(Date.now() / 1000);
		if (
			!token_expiration_timestamp ||
			current_timestamp_in_seconds > token_expiration_timestamp
		) {
			throw "JWT token has expired.";
		}
	}

	ensureUserpoolClientIdsMatch({
		decoded_jwt,
		userpool_client_id,
	}: EnsureUserpoolClientIdsMatchParams): void {
		if (decoded_jwt.aud !== userpool_client_id) {
			throw `JWT's "aud" property does not match the userpool client id`;
		}
	}
}

const fs = require("fs");
const jwt = require("jsonwebtoken");
const CognitoJwtVerifier = require("./CognitoJwtVerifier");

describe("CognitoJwtVerifier()", () => {
	var verifier;
	beforeEach(() => {
		jest.mock("./KeyManager");
		verifier = new CognitoJwtVerifier();
	});
	describe("verifyToken()", () => {
		test("throws error for missing params", async () => {
			let token = "token";
			let aws_region = "aws_region";
			let userpool_id = "userpool_id";
			let userpool_client_id = "userpool_client_id";
			await verifier
				.verifyToken({})
				.catch((e) => expect(e).toMatch('"token" parameter is required.'));
			await verifier
				.verifyToken({ token })
				.catch((e) => expect(e).toMatch('"aws_region" parameter is required.'));
			await verifier
				.verifyToken({ token, aws_region })
				.catch((e) =>
					expect(e).toMatch('"userpool_id" parameter is required.')
				);
			return verifier
				.verifyToken({ token, aws_region, userpool_id })
				.catch((e) =>
					expect(e).toMatch('"userpool_client_id" parameter is required.')
				);
		});
	});

	describe("ensureTokenIsNotExpired()", () => {
		test("does not throw error for unexpired token", () => {
			let future_expiration = Math.floor(Date.now() / 1000) + 5000;
			expect(() => {
				verifier.ensureTokenIsNotExpired(future_expiration);
			}).not.toThrow();
		});
		test("throws error for expired token", () => {
			let past_expiration = Math.floor(Date.now() / 1000) - 5000;
			expect(() => {
				verifier.ensureTokenIsNotExpired(past_expiration);
			}).toThrow();
		});
	});
});

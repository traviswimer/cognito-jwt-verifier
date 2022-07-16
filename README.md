# cognito-jwt-verifier

> Verifies and decodes an AWS Cognito JWT token.

## Installation

`yarn add cognito-jwt-verifier`

`npm install cognito-jwt-verifier`

## Usage

**Simple example:**

```Javascript
import CognitoJwtVerifier from "cognito-jwt-verifier";
const verifier = new CognitoJwtVerifier();

verifier.verifyToken({
	token: 'AwsCognitoToken',
	aws_region: 'us-east-1',
	userpool_id: 'AwsUserpoolId',
	userpool_client_id: 'AwsUserpoolClientId'
}).then((decoded_token)=>{
	// Token is valid
	console.log(decoded_token);
}).catch((err)=>{
	// Token is invalid or another error occurred
	console.error(err)
});
```

## What it does

This package is based on information from the following AWS documentation:
[https://aws.amazon.com/premiumsupport/knowledge-center/decode-verify-cognito-json-token/](https://aws.amazon.com/premiumsupport/knowledge-center/decode-verify-cognito-json-token/)

It performs the following tasks:

1. Reads the `kid`(key ID) from the token header, and uses it to retrieve the correct public key from AWS.
2. Uses the public key and the token to verify the token signature, using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
3. Checks that the token expiry timestamp is still a time in the future.
4. Checks that the `aud` token property matches the ID of the intended AWS userpool client.

**If you believe there may be a security flaws in this implementation, please open an issue ASAP.**

## API

### CognitoJwtVerifier

#### verifyToken({ token, aws_region, userpool_id, userpool_client_id })

- _token_ (string) - The AWS Cognito token to be verified.
- _aws_region_ (string) - The AWS region the userpool is located in.
- _userpool_id_ (string) - The ID of the userpool to be verified against.
- _userpool_client_id_ (string) - The ID of the userpool client to be verified against.

**returns a promise:**

- Resolves with: (Object) The decoded JWT token.

## Project Links

- [NPM](https://www.npmjs.com/package/cognito-jwt-verifier)
- [GitHub](https://github.com/traviswimer/cognito-jwt-verifier)

## Author

#### Travis Wimer

- <a href="https://traviswimer.com/developer-portfolio" title="React Native, React, NodeJS, UI/UX Developer" target="_blank">Developer Portfolio</a>
- <a href="https://traviswimer.com/blog" title="React Native, React, NodeJS, UI/UX Blog" target="_blank">Blog</a>
- <a href="https://www.linkedin.com/in/traviswimer/" title="Developer Resume" target="_blank">LinkedIn</a>
- <a href="https://twitter.com/Travis_Wimer" title="Travis Wimer | Software Developer" target="_blank">Twitter</a>
- <a href="https://traviswimer.com/developer-portfolio/cognito-jwt-verifier" title="cognito-jwt-verifier | Travis Wimer" target="_blank">cognito-jwt-verifier Portfolio Page</a>

## License

MIT. Copyright © 2022 Travis Wimer

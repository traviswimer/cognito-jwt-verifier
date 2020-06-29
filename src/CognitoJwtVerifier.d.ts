import KeyManager from "cognito-jwt-verifier/src/KeyManager";

export default class CognitoJwtVerifier{
  key_manager: KeyManager;
  verifyToken(params: { [x: string]: any; token?: any; aws_region?: any; userpool_id?: any; userpool_client_id?: any; }): string | object;
  ensureTokenIsValid(params: {token?: any; aws_region?: any; userpool_id?: any;}): any;
  ensureTokenIsNotExpired(token_expiration_timestamp: any): any;
  ensureUserpoolClientIdsMatch(params: {decoded_jwt: any, userpool_client_id: any}): any;
}

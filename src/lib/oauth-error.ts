export class OAuthTokenError extends Error {
  constructor(public code: string) {
    super("OAuth token request failed");
  }
}

/**
* Describes an access and refresh tokens attributes when not given by the identity provider.
*/
export interface OAuthTokenPropertiesDefinition {
  /**
  * Access token expiration length in seconds
  */
  accessTokenExpirationLength?: number;

  /**
  * Refresh token expiration length in seconds
  */
  refreshTokenExpirationLength?: number;
}

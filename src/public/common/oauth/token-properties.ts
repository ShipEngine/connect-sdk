/**
* Describes an access and refresh tokens attributes when not given by the identity provider.
*/
export interface OAuthTokenPropertiesDefinition {
  /**
  * Access token expiration length
  */
  accessTokenExpirationLength?: number;

  /**
  * Refresh token expiration length
  */
  refreshTokenExpirationLength?: number;

  /**
  * Unit of time for token expiration length 
  */
 tokenExpirationLengthTimeUnit?: string;
}

import type { InlineOrReference } from "../types";
import type { OAuthRequestDefinition } from './request'
import type { OAuthResponseDefinition } from './response'

/**
* Describes the data driven authorization processes.
*/
export interface OAuthAuthorizationProcessDefinition {
  /**
  * Login request made to the identity provider.
  */
  loginRequest: InlineOrReference<OAuthRequestDefinition>;

  /**
  * Expected redirect response after the identity provider has attempted to authenticate the user.
  */
  redirectRequest: InlineOrReference<OAuthResponseDefinition>;

  /**
  * Authorization request made to the identity provider to authorize the user after the identity has been established.
  */
  authorizeRequest?: InlineOrReference<OAuthRequestDefinition>;

  /**
  * Expected response to an authorization request.
  */
  authorizeResponse?: InlineOrReference<OAuthResponseDefinition>;
}

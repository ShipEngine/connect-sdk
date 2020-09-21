import type { InlineOrReference } from "../types";
import type { OAuthRequestDefinition } from './request'
import type { OAuthResponseDefinition } from './response'

/**
* Describes the data driven refresh token processes.
*/
export interface OAuthRefreshTokenProcessDefinition {
  /**
  * Request made to refresh an access token.
  */
  refreshTokenRequest: InlineOrReference<OAuthRequestDefinition>;

  /**
  * Expected response to a refresh token request.
  */
  refreshTokenResponse: InlineOrReference<OAuthResponseDefinition>;
}

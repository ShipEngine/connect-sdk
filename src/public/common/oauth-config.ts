import type { InlineOrReference } from "./types";
import type { OAuthAuthorizationProcessDefinition, } from "./oauth/authorization-process";
import type { OAuthRefreshTokenProcessDefinition } from "./oauth/refresh-token-process";
import type { OAuthTokenPropertiesDefinition } from "./oauth/token-properties";

/**
 * Configuration that defines a data driven OAuth flow.
 */
export interface OAuthConfigDefinition {
  /**
   * Describes an access and refresh tokens attributes when not given by the identity provider.
   */
  tokenProperties?: InlineOrReference<OAuthTokenPropertiesDefinition>;

  /**
   * Describes the data driven authorization processes.
   */
  authorizationProcess: InlineOrReference<OAuthAuthorizationProcessDefinition>;

  /**
   * Describes the data driven refresh token processes.
   */
  refreshTokenProcess?: InlineOrReference<OAuthRefreshTokenProcessDefinition>;
}

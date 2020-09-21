import { Joi } from "./validation";
import { OAuthAuthorizationProcess } from './oauth/authorization-process';
import { OAuthRefreshTokenProcess } from './oauth/refresh-token-process';
import { OAuthTokenProperties } from './oauth/token-properties';
import { hideAndFreeze, _internal } from "./utils";
import { OAuthConfigDefinition, OAuthTokenPropertiesDefinition } from "../../public";
import { OAuthAuthorizationProcessPOJO } from './oauth/authorization-process';
import { OAuthRefreshTokenProcessPOJO } from './oauth/refresh-token-process';

export interface OAuthConfigPOJO extends OAuthConfigDefinition {
  authorizationProcess: OAuthAuthorizationProcessPOJO;
  refreshTokenProcess?: OAuthRefreshTokenProcessPOJO;
  tokenProperties?: OAuthTokenPropertiesDefinition;
}

export class OAuthConfig {
  public static readonly [_internal] = {
    label: "oauth-config",
    schema: Joi.object({
      authorizationProcess: OAuthAuthorizationProcess[_internal].schema.required(),
      refreshTokenProcess: OAuthRefreshTokenProcess[_internal].schema.optional(),
      tokenProperties: OAuthTokenProperties[_internal].schema.optional(),
    })
  };

  public readonly authorizationProcess: OAuthAuthorizationProcess;
  public readonly refreshTokenProcess?: OAuthRefreshTokenProcess;
  public readonly tokenProperties?: OAuthTokenProperties;

  public constructor(pojo: OAuthConfigPOJO) {
    this.authorizationProcess = new OAuthAuthorizationProcess(pojo.authorizationProcess);
    this.refreshTokenProcess = pojo.refreshTokenProcess && new OAuthRefreshTokenProcess(pojo.refreshTokenProcess);
    this.tokenProperties = pojo.tokenProperties && new OAuthTokenProperties(pojo.tokenProperties);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

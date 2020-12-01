import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthRefreshTokenProcessDefinition, OAuthRequestDefinition, OAuthResponseDefinition } from "../../../public";
import { OAuthResponse } from './response';
import { OAuthRequest } from './request';

export interface OAuthRefreshTokenProcessPOJO extends OAuthRefreshTokenProcessDefinition {
  refreshTokenRequest: OAuthRequestDefinition;
  refreshTokenResponse: OAuthResponseDefinition;
}

export class OAuthRefreshTokenProcess {
  public static readonly [_internal] = {
    label: "oauth-refresh-token-process",
    schema: Joi.object({
      refreshTokenRequest: OAuthRequest[_internal].schema.required(),
      refreshTokenResponse: OAuthResponse[_internal].schema.required(),
    })
  };

  public readonly refreshTokenRequest: OAuthRequest;
  public readonly refreshTokenResponse: OAuthResponse;

  public constructor(pojo: OAuthRefreshTokenProcessPOJO) {
    this.refreshTokenRequest = new OAuthRequest(pojo.refreshTokenRequest);
    this.refreshTokenResponse = pojo.refreshTokenResponse;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

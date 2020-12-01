import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthAuthorizationProcessDefinition, OAuthRequestDefinition, OAuthResponseDefinition } from "../../../public";
import { OAuthResponse } from './response';
import { OAuthRequest } from './request';

export interface OAuthAuthorizationProcessPOJO extends OAuthAuthorizationProcessDefinition {
  loginRequest: OAuthRequestDefinition;
  redirectRequest: OAuthResponseDefinition;
  authorizeRequest?: OAuthRequestDefinition;
  authorizeResponse?: OAuthResponseDefinition;
}

export class OAuthAuthorizationProcess {
  public static readonly [_internal] = {
    label: "oauth-authorization-process",
    schema: Joi.object({
      loginRequest: OAuthRequest[_internal].schema.required(),
      redirectRequest: OAuthResponse[_internal].schema.required(),
      authorizeRequest: OAuthRequest[_internal].schema.optional(),
      authorizeResponse: OAuthResponse[_internal].schema.optional(),
    })
  };

  public readonly loginRequest: OAuthRequest;
  public readonly redirectRequest: OAuthResponse;
  public readonly authorizeRequest?: OAuthRequest;
  public readonly authorizeResponse?: OAuthResponse;

  public constructor(pojo: OAuthAuthorizationProcessPOJO) {
    this.loginRequest = new OAuthRequest(pojo.loginRequest);
    this.redirectRequest = pojo.redirectRequest;
    this.authorizeRequest = pojo.authorizeRequest ? new OAuthRequest(pojo.authorizeRequest) : undefined;
    this.authorizeResponse = pojo.authorizeResponse;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

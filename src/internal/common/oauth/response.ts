import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthResponseDefinition, OAuthParameterDefinition } from "../../../public";
import { OAuthParameter } from './parameter'

export class OAuthResponse {
  public static readonly [_internal] = {
    label: "oauth-response",
    schema: Joi.object({
      bodyParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
      headerParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
      queryParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
    })
  };

  public readonly bodyParameters?: readonly OAuthParameterDefinition[];
  public readonly headerParameters?: readonly OAuthParameterDefinition[];
  public readonly queryParameters?: readonly OAuthParameterDefinition[];

  public constructor(pojo: OAuthResponseDefinition) {
    this.bodyParameters = pojo.bodyParameters
      ? pojo.bodyParameters.map((bp) => new OAuthParameter(bp)) : [];
    this.headerParameters = pojo.headerParameters
      ? pojo.headerParameters.map((bp) => new OAuthParameter(bp)) : [];
    this.queryParameters = pojo.queryParameters
      ? pojo.queryParameters.map((bp) => new OAuthParameter(bp)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

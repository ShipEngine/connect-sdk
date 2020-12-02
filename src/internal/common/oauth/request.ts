import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthRequestDefinition, OAuthParameterDefinition, OAuthRequestMethods } from "../../../public";
import { OAuthParameter } from './parameter'

export class OAuthRequest {
  public static readonly [_internal] = {
    label: "oauth-response",
    schema: Joi.object({
      url: Joi.string().website().required(),
      method: Joi.string().valid("GET", "POST", "PUT").required(),
      contentType: Joi.string().valid("application/json", "application/x-www-form-urlencoded" ,"").optional(),
      bodyParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
      headerParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
      queryParameters: Joi.array().items(OAuthParameter[_internal].schema).optional(),
    })
  };



  public readonly url: string;
  public readonly method: OAuthRequestMethods;
  public readonly contentType: string;
  public readonly bodyParameters?: readonly OAuthParameterDefinition[];
  public readonly headerParameters?: readonly OAuthParameterDefinition[];
  public readonly queryParameters?: readonly OAuthParameterDefinition[];

  public constructor(pojo: OAuthRequestDefinition) {
    this.url = pojo.url;
    this.method = pojo.method;
    
    this.bodyParameters = pojo.bodyParameters
      ? pojo.bodyParameters.map((bp) => new OAuthParameter(bp)) : [];
    this.headerParameters = pojo.headerParameters
      ? pojo.headerParameters.map((bp) => new OAuthParameter(bp)) : [];
    this.queryParameters = pojo.queryParameters
      ? pojo.queryParameters.map((bp) => new OAuthParameter(bp)) : [];

      this.contentType = pojo.contentType ? 
      pojo.contentType : 
      (this.bodyParameters.length > 0 ? "application/json" : "");

    // Make this object immutable
    hideAndFreeze(this);
  }
}

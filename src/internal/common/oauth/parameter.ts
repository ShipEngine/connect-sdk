import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthParameterDefinition } from "../../../public";

export class OAuthParameter {
  public static readonly [_internal] = {
    label: "oauth-parameter",
    schema: Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
      encoding: Joi.string().valid("base64").optional(),
    })
  };

  public readonly name: string;
  public readonly value: string;
  public readonly encoding?: "base64";

  public constructor(pojo: OAuthParameterDefinition) {
    this.name = pojo.name;
    this.value = pojo.value;
    this.encoding = pojo.encoding;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

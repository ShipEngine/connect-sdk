import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { OAuthTokenPropertiesDefinition } from "../../../public";

export class OAuthTokenProperties {
  public static readonly [_internal] = {
    label: "oauth-token-properties",
    schema: Joi.object({
      accessTokenExpirationLength: Joi.number().min(1).optional(),
      refreshTokenExpirationLength: Joi.number().min(1).optional(),
      tokenExpirationLengthTimeUnit: Joi.string().optional(),
    })
  };

  public readonly accessTokenExpirationLength?: number;
  public readonly refreshTokenExpirationLength?: number;
  public readonly tokenExpirationLengthTimeUnit?: string;

  public constructor(pojo: OAuthTokenPropertiesDefinition) {
    this.accessTokenExpirationLength = pojo.accessTokenExpirationLength;
    this.refreshTokenExpirationLength = pojo.refreshTokenExpirationLength;
    this.tokenExpirationLengthTimeUnit = pojo.tokenExpirationLengthTimeUnit;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

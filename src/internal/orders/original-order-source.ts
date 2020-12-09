import { OriginalOrderSource as OriginalOrderSourcePOJO } from "../../public";
import { hideAndFreeze, Joi, _internal } from "../common";

export class OriginalOrderSource {
  public static readonly [_internal] = {
    label: "original order source",
    schema: Joi.object({
        sourceId: Joi.string().required(),
        marketplaceCode: Joi.string().required(),
        orderId: Joi.string().required()
    })
  };

  public readonly sourceId: string;
  public readonly marketplaceCode: string;
  public readonly orderId: string;

  public constructor(pojo: OriginalOrderSourcePOJO) {
    this.sourceId = pojo.sourceId;
    this.marketplaceCode = pojo.marketplaceCode;
    this.orderId = pojo.orderId;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

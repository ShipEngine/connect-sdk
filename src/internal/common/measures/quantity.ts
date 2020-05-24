import { Quantity as IQuantity, QuantityPOJO, QuantityUnit } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class Quantity implements IQuantity {
  public static readonly [_internal] = {
    label: "quantity",
    schema: Joi.object({
      value: Joi.number().integer().min(1).required(),
      unit: Joi.string().enum(QuantityUnit).required(),
    }),
  };

  public readonly value: number;
  public readonly unit: QuantityUnit;

  public constructor(pojo: QuantityPOJO) {
    this.value = pojo.value;
    this.unit = pojo.unit;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

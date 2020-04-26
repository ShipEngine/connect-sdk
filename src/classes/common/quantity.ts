import { QuantityUnit } from "../../enums";
import { QuantityPOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * The quantity of items in a package
 */
export class Quantity {
  //#region Class Fields

  public static readonly label = "quantity";

  /** @internal */
  public static readonly schema = Joi.object({
    value: Joi.number().integer().min(1).required(),
    unit: Joi.string().enum(QuantityUnit).required(),
  });

  //#endregion
  //#region Instance Fields

  public readonly value: number;
  public readonly unit: QuantityUnit;

  //#endregion

  public constructor(pojo: QuantityPOJO) {
    this.value = pojo.value;
    this.unit = pojo.unit;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

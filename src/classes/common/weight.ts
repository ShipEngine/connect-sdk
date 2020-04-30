import { WeightUnit } from "../../enums";
import { WeightPOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { hideAndFreeze, _internal } from "../utils";


/**
 * The weight of a package
 */
export class Weight {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "weight",
    schema: Joi.object({
      value: Joi.number().integer().min(1).required(),
      unit: Joi.string().enum(WeightUnit).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly value: number;
  public readonly unit: WeightUnit;

  //#endregion

  public constructor(pojo: WeightPOJO) {
    this.value = pojo.value;
    this.unit = pojo.unit;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Converts the weight to ounces
   */
  public toOunces(): Weight {
    switch (this.unit) {
      case WeightUnit.Grams:
        return new Weight({
          value: this.value * 0.035274,
          unit: WeightUnit.Ounces,
        });

      case WeightUnit.Kilograms:
        return new Weight({
          value: this.value * 35.274,
          unit: WeightUnit.Ounces,
        });

      case WeightUnit.Pounds:
        return new Weight({
          value: this.value * 16,
          unit: WeightUnit.Ounces,
        });

      default:
        return this;
    }
  }

  /**
   * Converts the weight to grams
   */
  public toGrams(): Weight {
    switch (this.unit) {
      case WeightUnit.Kilograms:
        return new Weight({
          value: this.value * 1000,
          unit: WeightUnit.Grams,
        });

      case WeightUnit.Pounds:
        return new Weight({
          value: this.value * 453.592,
          unit: WeightUnit.Grams,
        });

      case WeightUnit.Ounces:
        return new Weight({
          value: this.value * 28.3495,
          unit: WeightUnit.Grams,
        });

      default:
        return this;
    }
  }
}

// Prevent modifications to the class
hideAndFreeze(Weight);

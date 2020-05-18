import { hideAndFreeze, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";
import { WeightUnit } from "./enums";

/**
 * The weight of a package
 */
export interface WeightPOJO {
  value: number;
  unit: WeightUnit;
}


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
   * The weight in ounces
   */
  public get ounces(): number {
    switch (this.unit) {
      case WeightUnit.Grams:
        return this.value * 0.035274;

      case WeightUnit.Kilograms:
        return this.value * 35.274;

      case WeightUnit.Pounds:
        return this.value * 16;

      default:
        return this.value;
    }
  }

  /**
   * The weight in grams
   */
  public get grams(): number {
    switch (this.unit) {
      case WeightUnit.Kilograms:
        return this.value * 1000;

      case WeightUnit.Pounds:
        return this.value * 453.592;

      case WeightUnit.Ounces:
        return this.value * 28.3495;

      default:
        return this.value;
    }
  }

  /**
   * Returns the weight in ounces
   */
  public toOunces(): Weight {
    return new Weight({
      value: this.ounces,
      unit: WeightUnit.Ounces,
    });
  }

  /**
   * Returns the weight in grams
   */
  public toGrams(): Weight {
    return new Weight({
      value: this.grams,
      unit: WeightUnit.Grams,
    });
  }
}

// Prevent modifications to the class
hideAndFreeze(Weight);

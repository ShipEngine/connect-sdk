import { assert } from "./assert";
import { WeightConfig } from "./config";

/**
 * A weight measurement unit
 */
export enum WeightUnit {
  Grams = "g",
  Ounces = "oz",
  Kilograms = "kg",
  Pounds = "lb"
}


/**
 * The weight of a package
 */
export class Weight {
  public readonly value: number;
  public readonly unit: WeightUnit;

  public constructor(config: WeightConfig) {
    assert.type.object(config, "weight");
    this.value = assert.number.positive(config.value, "weight");
    this.unit = assert.string.enum(config.unit, WeightUnit, "weight unit");

    // Prevent modifications after validation
    Object.freeze(this);
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

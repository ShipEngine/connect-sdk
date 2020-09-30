import { Weight as IWeight, WeightPOJO, WeightUnit } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class Weight implements IWeight {
  public static readonly [_internal] = {
    label: "weight",
    schema: Joi.object({
      value: Joi.number().greater(0).required(),
      unit: Joi.string().enum(WeightUnit).required(),
    }),
  };

  public readonly value: number;
  public readonly unit: WeightUnit;

  public constructor(pojo: WeightPOJO) {
    this.value = pojo.value;
    this.unit = pojo.unit;

    // Make this object immutable
    hideAndFreeze(this);
  }

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

  public toOunces(): Weight {
    return new Weight({
      value: this.ounces,
      unit: WeightUnit.Ounces,
    });
  }

  public toGrams(): Weight {
    return new Weight({
      value: this.grams,
      unit: WeightUnit.Grams,
    });
  }
}

import {
  Dimensions as IDimensions,
  Dimensions as DimensionsPOJO,
  LengthUnit,
} from "../../../definitions";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class Dimensions implements IDimensions {
  public static [_internal] = {
    label: "dimensions",
    schema: Joi.object({
      length: Joi.number().min(0.1).required(),
      width: Joi.number().min(0.1).required(),
      height: Joi.number().min(0.1).required(),
      unit: Joi.string().enum(LengthUnit).required(),
    }),
  };

  public length: number;
  public width: number;
  public height: number;
  public unit: LengthUnit;

  public constructor(pojo: DimensionsPOJO) {
    this.length = pojo.length;
    this.width = pojo.width;
    this.height = pojo.height;
    this.unit = pojo.unit;

    // Make this object immutable
    hideAndFreeze(this);
  }

  public toInches(): Dimensions {
    switch (this.unit) {
      case LengthUnit.Centimeters:
        const centimetersToInches = 0.393701;
        return new Dimensions({
          length: this.length * centimetersToInches,
          width: this.width * centimetersToInches,
          height: this.height * centimetersToInches,
          unit: LengthUnit.Inches,
        });

      default:
        return this;
    }
  }

  public toCentimeters(): Dimensions {
    switch (this.unit) {
      case LengthUnit.Inches:
        const inchesToCentimeters = 2.54;
        return new Dimensions({
          length: this.length * inchesToCentimeters,
          width: this.width * inchesToCentimeters,
          height: this.height * inchesToCentimeters,
          unit: LengthUnit.Centimeters,
        });

      default:
        return this;
    }
  }
}

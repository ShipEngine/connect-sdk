import { Dimensions as IDimensions, DimensionsPOJO, LengthUnit } from "../../../public";
import { error, SystemErrorCode } from "../errors";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class Dimensions implements IDimensions {
  public static readonly [_internal] = {
    label: "dimensions",
    schema: Joi.object({
      length: Joi.number().min(0).optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional(),
      unit: Joi.string().enum(LengthUnit).required(),
    }),
  };

  public readonly length: number;
  public readonly width: number;
  public readonly height: number;
  public readonly unit: LengthUnit;

  public constructor(pojo: DimensionsPOJO) {

    this.length = pojo.length;
    this.width = pojo.width;
    this.height = pojo.height;
    this.unit = pojo.unit;

    // Check that at least two of the three dimensions properties are set. (Allows for 2 dimensional packages such as envelopes)
    const zeroCount = [this.length, this.width, this.height].reduce((totalCount, currentValue) => {
      if(!currentValue) {
        return totalCount + 1;
      }
      return totalCount;
    }, 0);

    if (zeroCount > 1) {
      const message = "Dimensions property must have at least 2 of the 3 length, width, and height properties set.";
      throw error(SystemErrorCode.InvalidInput, message);
    }

    // Make this object immutable
    hideAndFreeze(this);
  }

  public toInches(): Dimensions {
    const centimetersToInches = 0.393701;
    switch (this.unit) {
      case LengthUnit.Centimeters:
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
    const inchesToCentimeters = 2.54;
    switch (this.unit) {
      case LengthUnit.Inches:
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

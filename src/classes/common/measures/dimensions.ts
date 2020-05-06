import { LengthUnit } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { DimensionsPOJO } from "../../../pojos/common";

/**
 * The dimensions of a package
 */
export class Dimensions {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "dimensions",
    schema: Joi.object({
      length: Joi.number().integer().min(1).required(),
      width: Joi.number().integer().min(1).required(),
      height: Joi.number().integer().min(1).required(),
      unit: Joi.string().enum(LengthUnit).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly length: number;
  public readonly width: number;
  public readonly height: number;
  public readonly unit: LengthUnit;

  //#endregion

  public constructor(pojo: DimensionsPOJO) {
    this.length = pojo.length;
    this.width = pojo.width;
    this.height = pojo.height;
    this.unit = pojo.unit;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the dimensions in inches
   */
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

  /**
   * Returns the dimensions in centimeters
   */
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

// Prevent modifications to the class
hideAndFreeze(Dimensions);

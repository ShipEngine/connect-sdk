import { LengthUnit } from "../../enums";
import { DimensionsPOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * The dimensions of a package
 */
export class Dimensions {
  //#region Class Fields

  public static readonly label = "dimensions";

  /** @internal */
  public static readonly schema = Joi.object({
    length: Joi.number().integer().min(1).required(),
    width: Joi.number().integer().min(1).required(),
    height: Joi.number().integer().min(1).required(),
    unit: Joi.string().enum(LengthUnit).required(),
  });

  //#endregion
  //#region Instance Fields

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

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Converts the dimensions to inches
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
   * Converts the dimensions to centimeters
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

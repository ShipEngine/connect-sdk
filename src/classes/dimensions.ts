import { assert } from "../assert";
import { LengthUnit } from "../enums";
import { DimensionsPOJO } from "../pojos";

/**
 * The dimensions of a package
 */
export class Dimensions {
  public readonly length: number;
  public readonly width: number;
  public readonly height: number;
  public readonly unit: LengthUnit;

  public constructor(pojo: DimensionsPOJO) {
    assert.type.object(pojo, "dimensions");
    this.length = assert.number.positive(pojo.length, "package length");
    this.width = assert.number.positive(pojo.width, "package width");
    this.height = assert.number.positive(pojo.height, "package height");
    this.unit = assert.string.enum(pojo.unit, LengthUnit, "dimension unit");

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

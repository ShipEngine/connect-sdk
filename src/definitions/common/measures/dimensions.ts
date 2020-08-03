/**
 * A length measurement unit
 */
export enum LengthUnit {
  Inches = "in",
  Centimeters = "cm"
}

/**
 * The dimensions of a package
 */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: LengthUnit;
}

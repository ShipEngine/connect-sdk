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
export interface Weight {
  value: number;
  unit: WeightUnit;
}

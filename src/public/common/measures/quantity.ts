/**
 * A quantity measurement unit
 */
export enum QuantityUnit {
  Each = "ea",
}

/**
 * The quantity of items in a package
 */
export interface QuantityPOJO {
  value: number;
  // The platform doen't support quantity units
  // unit: QuantityUnit;
}

/**
 * The quantity of items in a package
 */
export interface Quantity {
  readonly value: number;
  readonly unit: QuantityUnit;
}

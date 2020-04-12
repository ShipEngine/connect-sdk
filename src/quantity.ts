import { assert } from "./assert";
import { QuantityConfig } from "./config";

/**
 * A quantity measurement unit
 */
export enum QuantityUnit {
  Each = "ea",
}

/**
 * The quantity of items in a package
 */
export class Quantity {
  public readonly value: number;
  public readonly unit: QuantityUnit;

  public constructor(config: QuantityConfig) {
    assert.type.object(config, "quantity");
    this.value = assert.number.positive(config.value, "quantity");
    this.unit = assert.string.enum(config.unit, QuantityUnit, "quantity unit");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

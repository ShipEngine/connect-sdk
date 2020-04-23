import { assert } from "../assert";
import { QuantityUnit } from "../enums";
import { QuantityPOJO } from "../pojos";

/**
 * The quantity of items in a package
 */
export class Quantity {
  public readonly value: number;
  public readonly unit: QuantityUnit;

  public constructor(pojo: QuantityPOJO) {
    assert.type.object(pojo, "quantity");
    this.value = assert.number.positive(pojo.value, "quantity");
    this.unit = assert.string.enum(pojo.unit, QuantityUnit, "quantity unit");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

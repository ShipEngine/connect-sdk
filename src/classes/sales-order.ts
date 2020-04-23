// tslint:disable: max-classes-per-file
import { assert } from "../assert";
import { SalesOrderIdentifierPOJO } from "../pojos";
import { Identifier } from "../types";

/**
 * Identifies a sales order
 */
export class SalesOrderIdentifier {
  /**
   * The vendor's unique ID for the order
   */
  public readonly salesOrderID: string;

  /**
   * Alternative identifiers associated with this sales order
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    assert.type.object(pojo, "sales order");
    this.salesOrderID = assert.string.nonWhitespace(pojo.salesOrderID, "sales order ID");
    this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "identifiers", []);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}

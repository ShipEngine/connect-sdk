// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { SalesOrderIdentifierConfig } from "./config";
import { Identifier } from "./types";

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
  public readonly identifiers: Identifier[];

  public constructor(config: SalesOrderIdentifierConfig) {
    assert.type.object(config, "sales order");
    this.salesOrderID = assert.string.nonWhitespace(config.salesOrderID, "sales order ID");
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "identifiers", []);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}

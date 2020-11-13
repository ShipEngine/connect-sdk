import type { Identifiers, IdentifiersPOJO } from "../common";


/**
 * Identifies an item in a sales order
 */
export interface SalesOrderItemIdentifierPOJO {
  /**
   * The marketplace's unique ID for the order item
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku?: string;

  /**
   * Your own identifiers for this item
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies an item in a sales order
 */
export interface SalesOrderItemIdentifier {
  /**
   * The marketplace's unique ID for the sales order
   */
  readonly id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  readonly sku: string;

  /**
   * Your own identifiers for this sales order
   */
  readonly identifiers: Identifiers;
}

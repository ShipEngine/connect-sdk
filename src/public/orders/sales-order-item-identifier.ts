import type { Identifiers } from "../common";

/**
 * Identifies an item in a sales order
 */
export interface SalesOrderItemIdentifier {
  /**
   * The marketplace's unique ID for the sales order
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku: string;

  /**
   * Your own identifiers for this sales order
   */
  identifiers: Identifiers;
}

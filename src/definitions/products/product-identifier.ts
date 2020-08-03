import type { Identifiers } from "../common";

/**
 * Identifies a product
 */
export interface ProductIdentifier {
  /**
   * The product catalog's unique ID for the order
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku: string;

  /**
   * Your own identifiers for this product
   */
  identifiers: Identifiers;
}

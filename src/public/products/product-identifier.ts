import type { Identifiers, IdentifiersPOJO } from "../common";

/**
 * Identifies a product
 */
export interface ProductIdentifierPOJO {
  /**
   * The product catalog's unique ID for the order
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku?: string;

  /**
   * Your own identifiers for this product
   */
  identifiers?: IdentifiersPOJO;
}

/**
 * Identifies a product
 */
export interface ProductIdentifier {
  /**
   * The product catalog's unique ID for the order
   */
  readonly id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  readonly sku: string;

  /**
   * Your own identifiers for this product
   */
  readonly identifiers: Identifiers;
}

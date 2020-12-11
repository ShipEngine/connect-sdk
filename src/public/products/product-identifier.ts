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
   * The Universal Product Code for this item.
   */
  upc?: string;

  /**
   * The International Standard Book Number for this item.
   */
  isbn?: string;

  /**
   * The Amazon Standard Identification Number for this item.
   */
  asin?: string;

  /**
   * The Stock Keeping Unit related to the fulfillment of this item.
   */
  fulfillmentSku?: string;

  /**
   * Inventory ID for this item.
   */
  inventoryID?: string;

  /**
   * Your own identifiers for this product
   */
  identifiers?: IdentifiersPOJO;

  /**
   * A list of details associated with this product
   * { "Color": "White", "Style": "Avant Garde" }
   */
  details?: IdentifiersPOJO;
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
   * The Universal Product Code for this item.
   */
  readonly upc: string;

  /**
   * The International Standard Book Number for this item.
   */
  readonly isbn: string;

  /**
   * The Amazon Standard Identification Number for this item.
   */
  readonly asin: string;

  /**
   * The Stock Keeping Unit related to the fulfillment of this item.
   */
  readonly fulfillmentSku: string;

  /**
   * Inventory ID for this item.
   */
  readonly inventoryID: string;

  /**
   * Your own identifiers for this product
   */
  readonly identifiers: Identifiers;

  /**
   * A list of details associated with this product
   * { "Color": "White", "Style": "Avant Garde" }
   */
  readonly details: Identifiers;
}

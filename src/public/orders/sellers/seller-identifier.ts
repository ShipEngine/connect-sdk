import type { Identifiers, IdentifiersPOJO } from "../../common";

/**
 * Identifies a seller who sells goods in a marketplace
 */
export interface SellerIdentifierPOJO {
  /**
   * The marketplace's unique ID for the seller
   */
  id: string;

  /**
   * Your own identifiers for this seller
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a seller who sells goods in a marketplace
 */
export interface SellerIdentifier {
  /**
   * The marketplace's unique ID for the seller
   */
  readonly id: string;

  /**
   * Your own identifiers for this seller
   */
  readonly identifiers: Identifiers;
}

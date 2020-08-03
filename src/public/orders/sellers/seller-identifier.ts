import type { Identifiers } from "../../common";

/**
 * Identifies a seller who sells goods in a marketplace
 */
export interface SellerIdentifier {
  /**
   * The marketplace's unique ID for the seller
   */
  id: string;

  /**
   * Your own identifiers for this seller
   */
  identifiers: Identifiers;
}

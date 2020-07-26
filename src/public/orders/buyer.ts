import type { ContactInfo, ContactInfoPOJO, Identifiers, IdentifiersPOJO } from "../common";

/**
 * The person who bought a sales order
 */
export interface BuyerPOJO extends ContactInfoPOJO {
  /**
   * The marketplace's unique ID for the buyer
   */
  id: string;
}


/**
 * The person who bought a sales order
 */
export interface Buyer extends ContactInfo {
  /**
   * The marketplace's unique ID for the sales order
   */
  readonly id: string;
}

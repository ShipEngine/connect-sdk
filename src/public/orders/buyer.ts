import type { AddressPOJO, ContactInfoPOJO } from "../common";

/**
 * The person who bought a sales order
 */
export interface Buyer extends ContactInfoPOJO {
  /**
   * The marketplace's unique ID for the buyer
   */
  id?: string;

  address?: AddressPOJO;
}

import type { Address, Identifiers } from "../../common";

/**
 * A warehouse in a marketplace where a seller sells their goods
 */
export interface Warehouse {
  /**
   * The marketplace's unique ID for the warehouse
   */
  id: string;

  /**
   * Your own identifiers for this warehouse
   */
  identifiers: Identifiers;

  /**
   * The user-friendly warehouse name (e.g. "East Coast Warehouse")
   */
  name: string;

  /**
   * The address used for packages that are shipped out of this warehouse
   */
  shipFrom: Address;

  /**
   * The return address for this warehouse
   */
  returnTo: Address;
}

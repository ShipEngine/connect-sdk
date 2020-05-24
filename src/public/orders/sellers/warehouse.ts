import type { Address, AddressPOJO, Identifiers, IdentifiersPOJO } from "../../common";

/**
 * A warehouse in a marketplace where a seller sells their goods
 */
export interface WarehousePOJO {
  /**
   * The marketplace's unique ID for the warehouse
   */
  id: string;

  /**
   * Your own identifiers for this warehouse
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The user-friendly warehouse name (e.g. "East Coast Warehouse")
   */
  name?: string;

  /**
   * The address used for packages that are shipped out of this warehouse
   */
  shipFrom: AddressPOJO;

  /**
   * The return address for this warehouse. Defaults to the `shipFrom` address
   */
  returnTo?: AddressPOJO;
}


/**
 * A warehouse in a marketplace where a seller sells their goods
 */
export interface Warehouse {
  /**
   * The marketplace's unique ID for the warehouse
   */
  readonly id: string;

  /**
   * Your own identifiers for this warehouse
   */
  readonly identifiers: Identifiers;

  /**
   * The user-friendly warehouse name (e.g. "East Coast Warehouse")
   */
  readonly name: string;

  /**
   * The address used for packages that are shipped out of this warehouse
   */
  readonly shipFrom: Address;

  /**
   * The return address for this warehouse
   */
  readonly returnTo: Address;
}

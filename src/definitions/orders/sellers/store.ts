import type { Identifiers } from "../../common";
import type { Warehouse } from "./warehouse";

/**
 * A store in a marketplace where a seller sells their goods
 */
export interface Store {
  /**
   * The marketplace's unique ID for the store
   */
  id: string;

  /**
   * Your own identifiers for this store
   */
  identifiers: Identifiers;

  /**
   * The store's name
   */
  name: string;

  /**
   * The store's warehouse locations
   */
  warehouses: Array<Warehouse>;
}

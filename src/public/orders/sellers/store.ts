import type { Identifiers, IdentifiersPOJO } from "../../common";
import type { Warehouse, WarehousePOJO } from "./warehouse";

/**
 * A store in a marketplace where a seller sells their goods
 */
export interface StorePOJO {
  /**
   * The marketplace's unique ID for the store
   */
  id: string;

  /**
   * Your own identifiers for this store
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The store's name
   */
  name: string;

  /**
   * The store's warehouse locations
   */
  warehouses?: ReadonlyArray<WarehousePOJO>;
}


/**
 * A store in a marketplace where a seller sells their goods
 */
export interface Store {
  /**
   * The marketplace's unique ID for the store
   */
  readonly id: string;

  /**
   * Your own identifiers for this store
   */
  readonly identifiers: Identifiers;

  /**
   * The store's name
   */
  readonly name: string;

  /**
   * The store's warehouse locations
   */
  readonly warehouses: ReadonlyArray<Warehouse>;
}

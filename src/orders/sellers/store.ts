import { Identifiers, IdentifiersPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { Warehouse, WarehousePOJO } from "./warehouse";


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
export class Store {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "store",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      warehouses: Joi.array().items(Warehouse[_internal].schema),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The marketplace's unique ID for the store
   */
  public readonly id: string;

  /**
   * Your own identifiers for this store
   */
  public readonly identifiers: Identifiers;

  /**
   * The store's name
   */
  public readonly name: string;

  /**
   * The store's warehouse locations
   */
  public readonly warehouses: ReadonlyArray<Warehouse>;

  //#endregion

  public constructor(pojo: StorePOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.name = pojo.name;
    this.warehouses = pojo.warehouses ? pojo.warehouses.map((wh) => new Warehouse(wh)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Store);

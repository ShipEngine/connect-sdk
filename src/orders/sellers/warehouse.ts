import { Address, AddressPOJO, Identifiers, IdentifiersPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";


/**
 * A warehouse in a marketplace where a seller sells their goods
 */
export interface WarehousePOJO {
  /**
   * The marketplace's unique ID for the warehouse
   */
  warehouseID: string;

  /**
   * Custom identifiers for this warehouse
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
export class Warehouse {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "warehouse",
    schema: Joi.object({
      warehouseID: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      name: Joi.string().trim().singleLine().min(1).max(100),
      shipFrom: Address[_internal].schema.required(),
      returnTo: Address[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The marketplace's unique ID for the warehouse
   */
  public readonly warehouseID: string;

  /**
   * Custom identifiers for this warehouse
   */
  public readonly identifiers: Identifiers;

  /**
   * The user-friendly warehouse name (e.g. "East Coast Warehouse")
   */
  public readonly name: string;

  /**
   * The address used for packages that are shipped out of this warehouse
   */
  public readonly shipFrom: Address;

  /**
   * The return address for this warehouse
   */
  public readonly returnTo: Address;

  //#endregion

  public constructor(pojo: WarehousePOJO) {
    this.warehouseID = pojo.warehouseID;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.name = pojo.name || "";
    this.shipFrom = new Address(pojo.shipFrom);
    this.returnTo = pojo.returnTo ? new Address(pojo.returnTo) : this.shipFrom;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Warehouse);

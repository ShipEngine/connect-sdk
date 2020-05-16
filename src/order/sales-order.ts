import { Identifiers, IdentifiersPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../internal";


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The vendor's unique ID for the order
   */
  orderNumber: string;

  /**
   * Custom identifiers for this shipment
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a sales order
 */
export class SalesOrderIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order",
    schema: Joi.object({
      salesOrderID: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The vendor's unique ID for the order
   */
  public readonly orderNumber: string;

  /**
   * Custom identifiers for this sales order
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.orderNumber = pojo.orderNumber;
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderIdentifier);

import { Identifier, IdentifierPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../internal";


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The vendor's unique ID for the order
   */
  salesOrderID: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  identifiers?: IdentifierPOJO[];
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
      identifiers: Joi.array().items(Identifier[_internal].schema),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The vendor's unique ID for the order
   */
  public readonly salesOrderID: string;

  /**
   * Alternative identifiers associated with this sales order
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  //#endregion

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.salesOrderID = pojo.salesOrderID;
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderIdentifier);

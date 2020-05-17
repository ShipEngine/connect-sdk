import { Identifiers, IdentifiersPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../internal";


/**
 * Identifies an item in a sales order
 */
export interface SalesOrderItemIdentifierPOJO {
  /**
   * The marketplace's unique ID for the order item
   */
  salesOrderItemID: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku?: string;

  /**
   * Custom identifiers for this item
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies an item in a sales order
 */
export class SalesOrderItemIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order item",
    schema: Joi.object({
      salesOrderItemID: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The marketplace's unique ID for the order item
   */
  public readonly salesOrderItemID: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  public readonly sku: string;

  /**
   * Custom identifiers for this item
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    this.salesOrderItemID = pojo.salesOrderItemID;
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderItemIdentifier);

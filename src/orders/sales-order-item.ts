import { hideAndFreeze, Joi, _internal } from "../common/internal";
import { SalesOrderItemIdentifier, salesOrderItemIdentifierMixin, SalesOrderItemIdentifierPOJO } from "./sales-order-item-identifier";


/**
 * An item in a sales order
 */
export interface SalesOrderItemPOJO extends SalesOrderItemIdentifierPOJO {
  /**
   * XXXXXXXXXX
   */
  xxxxx?: string;
}


/**
 * An item in a sales order
 */
export class SalesOrderItem extends salesOrderItemIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order item",
    schema: SalesOrderItemIdentifier[_internal].schema.keys({
      xxxxx: Joi.string()
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * XXXXXXXXXX
   */
  public readonly xxxxx: string;

  //#endregion

  public constructor(pojo: SalesOrderItemPOJO) {
    super(pojo);

    this.xxxxx = pojo.xxxxx || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderItem);

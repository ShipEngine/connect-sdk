import { hideAndFreeze, Joi, _internal } from "../common/internal";
import { SalesOrderIdentifier, salesOrderIdentifierMixin, SalesOrderIdentifierPOJO } from "./sales-order-identifier";


/**
 * A sales order
 */
export interface SalesOrderPOJO extends SalesOrderIdentifierPOJO {
  /**
   * XXXXXXXXXX
   */
  xxxxx?: string;
}


/**
 * A sales order
 */
export class SalesOrder extends salesOrderIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
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

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.xxxxx = pojo.xxxxx || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrder);

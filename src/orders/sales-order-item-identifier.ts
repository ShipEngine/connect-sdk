import { Identifiers, IdentifiersPOJO } from "../common";
import { Constructor, hideAndFreeze, Joi, _internal } from "../common/internal";


/**
 * Identifies an item in a sales order
 */
export interface SalesOrderItemIdentifierPOJO {
  /**
   * The marketplace's unique ID for the order item
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku?: string;

  /**
   * Your own identifiers for this item
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies an item in a sales order
 */
export class SalesOrderItemIdentifier extends salesOrderItemIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order item",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderItemIdentifier);

/**
 * Extends a base class with the fields of a sales order identifier
 * @internal
 */
export function salesOrderItemIdentifierMixin(base: Constructor = Object) {
  return class SalesOrderItemIdentifierMixin extends base {
    //#region Public Fields

    /**
     * The marketplace's unique ID for the sales order
     */
    public readonly id: string;

    /**
     * The Stock Keeping Unit code for this item
     */
    public readonly sku: string;

    /**
     * Your own identifiers for this sales order
     */
    public readonly identifiers: Identifiers;

    //#endregion

    public constructor(pojo: SalesOrderItemIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.id = pojo.id;
      this.sku = pojo.sku || "";
      this.identifiers = new Identifiers(pojo.identifiers);
    }
  };
}

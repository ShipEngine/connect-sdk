import { Identifiers, IdentifiersPOJO } from "../common";
import { Constructor, hideAndFreeze, Joi, _internal } from "../internal";


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The marketplace's unique ID for the sales order
   */
  salesOrderID: string;

  /**
   * Custom identifiers for this sales order
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a sales order
 */
export class SalesOrderIdentifier extends salesOrderIdentifierMixin() {
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

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderIdentifier);

/**
 * Extends a base class with the fields of a sales order identifier
 * @internal
 */
export function salesOrderIdentifierMixin(base: Constructor = Object) {
  return class SalesOrderIdentifierMixin extends base {
    //#region Public Fields

    /**
     * The marketplace's unique ID for the sales order
     */
    public readonly salesOrderID: string;

    /**
     * Custom identifiers for this sales order
     */
    public readonly identifiers: Identifiers;

    //#endregion

    public constructor(pojo: SalesOrderIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.salesOrderID = pojo.salesOrderID;
      this.identifiers = new Identifiers(pojo.identifiers);
    }
  };
}

import { Identifiers, IdentifiersPOJO } from "../../common";
import { Constructor, hideAndFreeze, Joi, _internal } from "../../common/internal";

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifierPOJO {
  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the package tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  trackingNumber?: string;

  /**
   * Your own identifiers for this shipment
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a shipment
 */
export class ShipmentIdentifier extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      trackingNumber: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: ShipmentIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentIdentifier);


/**
 * Extends a base class with shipment identifier fields
 * @internal
 */
export function shipmentIdentifierMixin(base: Constructor = Object) {
  return class ShipmentIdentifierMixin extends base {
    //#region Public Fields

    /**
     * The master tracking number for the entire shipment.
     * For single-piece shipments, this will be the same as the package tracking number.
     * For multi-piece shipments, this may be a separate tracking number, or the same
     * tracking number as one of the packages.
     */
    public readonly trackingNumber: string;

    /**
     * Your own identifiers for this shipment
     */
    public readonly identifiers: Identifiers;

    //#endregion

    public constructor(pojo: ShipmentIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.trackingNumber = pojo.trackingNumber || "";
      this.identifiers = new Identifiers(pojo.identifiers);
    }
  };
}

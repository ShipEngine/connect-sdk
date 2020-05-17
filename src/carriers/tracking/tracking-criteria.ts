import { hideAndFreeze, Joi, _internal } from "../../internal";
import { ShipmentIdentifier, shipmentIdentifierMixin, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * The information needed to request tracking information for a shipment
 */
export interface TrackingCriteriaPOJO extends ShipmentIdentifierPOJO {
  /**
   * Return shipment details. If `undefined`, then it is assumed that the shipment is not a return.
   */
  returns?: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn?: boolean;
  };

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}


/**
 * The information needed to request tracking information for a shipment
 */
export class TrackingCriteria extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      returns: Joi.object({
        isReturn: Joi.boolean(),
      }),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Return shipment details
   */
  public readonly returns: {
    /**
     * Indicates whether this is a return shipment
     */
    readonly isReturn: boolean;
  };

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingCriteria);

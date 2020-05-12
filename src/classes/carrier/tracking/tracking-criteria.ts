import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { TrackingCriteriaPOJO } from "../../../pojos/carrier";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "../shipments/shipment-identifier";

/**
 * The information needed to request tracking information for a shipment
 */
export class TrackingCriteria extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      isReturn: Joi.boolean(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates whether this is a return shipment
   */
  public readonly isReturn: boolean;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO) {
    super(pojo);

    this.isReturn = pojo.isReturn || false;
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingCriteria);

import { hideAndFreeze, Joi, _internal } from "../../internal";
import { ShipmentIdentifier, shipmentIdentifierMixin, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Cancellation of a previously-created shipment
 */
export interface ShipmentCancellationPOJO extends ShipmentIdentifierPOJO {
  /**
   * ShipEngine's unique identifier for the shipment. This ID must be returned, along with a flag
   * indicating whether it was successfully canceled.
   */
  shipmentID: string;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}


/**
 * Cancellation of a previously-created shipment
 */
export class ShipmentCancellation extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      shipmentID: Joi.string().trim().singleLine().min(1).max(100).required(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * ShipEngine's unique identifier for the shipment. This ID must be returned, along with a flag
   * indicating whether it was successfully canceled.
   */
  public readonly shipmentID: string;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentCancellationPOJO) {
    super(pojo);

    this.shipmentID = pojo.shipmentID;
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentCancellation);

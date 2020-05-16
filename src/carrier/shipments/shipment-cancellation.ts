import { hideAndFreeze, Joi, _internal } from "../../internal";
import { UUID } from "../../types";
import { ShipmentIdentifier, shipmentIdentifierMixin, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Cancellation of a previously-created shipment
 */
export interface ShipmentCancellationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The unique ID of this cancellation request. This ID is used to correlate
   * requested cancellations with cancellation confirmations.
   */
  cancellationRequestID: UUID;

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
      cancellationRequestID: Joi.string().uuid().required(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The unique ID of this cancellation request. This ID is used to correlate
   * requested cancellations with cancellation confirmations.
   */
  public readonly cancellationRequestID: UUID;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentCancellationPOJO) {
    super(pojo);

    this.cancellationRequestID = pojo.cancellationRequestID;
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentCancellation);

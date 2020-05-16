import { hideAndFreeze, Joi, _internal } from "../../internal";
import { UUID } from "../../types";
import { ShipmentCancellationConfirmationPOJO } from "./shipment-cancellation-confirmation-pojo";
import { ShipmentIdentifier } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been canceled
 */
export class ShipmentCancellationConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      cancellationRequestID: Joi.string().uuid().required(),
      cancellationID: Joi.string().trim().singleLine().allow("").max(100),
      isError: Joi.boolean(),
      errorCode: Joi.string().trim().singleLine().min(1).max(100),
      errorDescription: Joi.string().trim().singleLine().allow("").max(1000),
      note: Joi.string().allow("").max(5000),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates which cancellation request this confirmation is for.
   */
  public readonly cancellationRequestID: UUID;

  /**
   * The carrier's cancellation ID, if any
   */
  public readonly cancellationID: string;

  /**
   * Indicates whether the cancellation failed or was successful
   */
  public readonly isError: boolean;

  /**
   * The carrier's error code
   */
  public readonly errorCode: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  public readonly errorDescription: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly note: string;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentCancellationConfirmationPOJO) {
    this.cancellationRequestID = pojo.cancellationRequestID;
    this.cancellationID = pojo.cancellationID || "";
    this.isError = pojo.isError || false;
    this.errorCode = pojo.errorCode || "";
    this.errorDescription = pojo.errorDescription || "";
    this.note = pojo.note || "";
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentCancellationConfirmation);

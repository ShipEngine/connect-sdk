import { hideAndFreeze, Joi, _internal } from "../../internal";
import { PickupCancellationConfirmationPOJO } from "./pickup-cancellation-confirmation-pojo";

/**
 * Confirmation that a package pickup has been canceled
 */
export class PickupCancellationConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup",
    schema: Joi.object({
      pickupID: Joi.string().trim().singleLine().min(1).max(100).required(),
      successful: Joi.boolean().required(),
      cancellationNumber: Joi.string().trim().singleLine().allow("").max(100),
      notes: Joi.string().allow("").max(5000),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * ShipEngine's unique identifier for the pickup. Indicates which pickup this cancellation
   * confirmation is for.
   */
  public readonly pickupID: string;

  /**
   * Indicates whether the pickup was successfully canceled.
   * If the pickup was _not_ canceled, then the `notes` field should contain
   * information and/or instructions for the customer. (e.g. "Please call ###-#### to cancel")
   */
  public readonly successful: boolean;

  /**
   * The carrier's cancellation number, if any
   */
  public readonly cancellationNumber: string;

  /**
   * Additional information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly notes: string;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata?: object;

  //#endregion

  public constructor(pojo: PickupCancellationConfirmationPOJO) {
    this.pickupID = pojo.pickupID;
    this.successful = pojo.successful;
    this.cancellationNumber = pojo.cancellationNumber || "";
    this.notes = pojo.notes || "";
    this.metadata = pojo.metadata;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupCancellationConfirmation);

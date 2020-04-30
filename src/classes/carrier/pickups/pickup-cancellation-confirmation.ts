import { PickupCancellationConfirmationPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { CustomData } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";

/**
 * Confirmation that a package pickup has been canceled
 */
export class PickupCancellationConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup cancellation confirmation",
    schema: Joi.object({
      successful: Joi.boolean().required(),
      cancellationID: Joi.string().trim().singleLine().allow("").max(100),
      notes: Joi.string().allow("").max(5000),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates whether the pickup was successfully canceled.
   * If the pickup was _not_ canceled, then the `notes` field should contain
   * information and/or instructions for the customer. (e.g. "Please call ###-#### to cancel")
   */
  public readonly successful: boolean;

  /**
   * The carrier's cancellation ID, if any
   */
  public readonly cancellationID: string;

  /**
   * Additional information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly notes: string;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   * If the pickup is later canceled, this data will be included.
   */
  public readonly customData?: CustomData;

  //#endregion

  public constructor(pojo: PickupCancellationConfirmationPOJO) {
    validate(pojo, PickupCancellationConfirmation);

    this.successful = pojo.successful;
    this.cancellationID = pojo.cancellationID || "";
    this.notes = pojo.notes || "";
    this.customData = pojo.customData && new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupCancellationConfirmation);

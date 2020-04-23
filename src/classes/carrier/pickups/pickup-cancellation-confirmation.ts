import { assert } from "../../../assert";
import { PickupCancellationConfirmationPOJO } from "../../../pojos";
import { CustomData } from "../../../types";

/**
 * Confirmation that a package pickup has been canceled
 */
export class PickupCancellationConfirmation {
  /**
   * Indicates whether the pickup was successfully canceled.
   * If the pickup was _not_ canceled, then the `notes` field should contain
   * information and/or instructions for the customer. (e.g. "Please call ###-#### to cancel")
   */
  public readonly successful: boolean;

  /**
   * The carrier's cancellation ID, if any
   */
  public readonly cancellationID?: string;

  /**
   * Additional information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly notes: string;

  /**
   * Arbitrary data for that will be persisted by ShipEngine IPaaS.
   * If the pickup is later canceled, this data will be included.
   */
  public readonly customData?: CustomData;

  public constructor(pojo: PickupCancellationConfirmationPOJO) {
    assert.type.object(pojo, "pickup confirmation");
    this.successful = assert.type.boolean(pojo.successful, "successful indicator");
    this.cancellationID =
      pojo.cancellationID && assert.string.nonWhitespace(pojo.cancellationID, "cancellation ID");
    this.notes = assert.string(pojo.notes, "pickup confirmation notes", "");
    this.customData = assert.type.customData(pojo.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.customData);
  }
}

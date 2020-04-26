import { CustomDataPOJO } from "../common";

/**
 * Confirmation that a package pickup has been canceled
 */
export interface PickupCancellationConfirmationPOJO {
  /**
   * Indicates whether the pickup was successfully canceled.
   * If the pickup was _not_ canceled, then the `notes` field should contain
   * information and/or instructions for the customer. (e.g. "Please call ###-#### to cancel")
   */
  successful: boolean;

  /**
   * The carrier's cancellation ID, if any
   */
  cancellationID?: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  notes?: string;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  customData?: CustomDataPOJO;
}

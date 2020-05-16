import { NotePOJO } from "../../common";
import { UUID } from "../../types";

/**
 * Confirmation that a shipment has been canceled
 */
export interface ShipmentCancellationConfirmationPOJO {
  /**
   * Indicates which cancellation request this confirmation is for.
   */
  cancellationRequestID: UUID;

  /**
   * The carrier's cancellation ID, if any
   */
  cancellationID?: string;

  /**
   * Indicates whether the cancellation failed or was successful
   */
  isError?: boolean;

  /**
   * The carrier's error code
   */
  errorCode?: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  errorDescription?: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  notes?: string | Array<string | NotePOJO>;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

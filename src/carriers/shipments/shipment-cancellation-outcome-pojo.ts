import { CancellationStatus, NotePOJO } from "../../common";
import { UUID } from "../../types";

/**
 * The outcome of a shipment cancellation
 */
export interface ShipmentCancellationOutcomePOJO {
  /**
   * Indicates which cancellation request this confirmation is for.
   */
  cancellationID: UUID;

  /**
   * The status of the cancellation
   */
  status: CancellationStatus;

  /**
   * The confirmation ID of the cancellation
   */
  confirmationID?: string;

  /**
   * The carrier's code for this cancellation outcome
   */
  code?: string;

  /**
   * The carrier's description of the cancellation outcome.
   * This description should not be specific to this particular shipment.
   */
  description?: string;

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

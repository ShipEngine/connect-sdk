import type { CancellationStatus, NotePOJO, UUID } from "../../common";

/**
 * The outcome of a shipment cancellation
 */
export interface ShipmentCancellationOutcome {
  /**
   * Indicates which cancellation request this confirmation is for.
   */
  cancellationID: UUID;

  /**
   * The status of the cancellation
   */
  status: CancellationStatus;

  /**
   * The confirmation number of the cancellation
   */
  confirmationNumber?: string;

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
  notes?: NotePOJO[];

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Connect.
   * Must be JSON serializable.
   */
  metadata?: object;
}

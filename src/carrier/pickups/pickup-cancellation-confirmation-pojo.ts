/**
 * Confirmation that a package pickup has been canceled
 */
export interface PickupCancellationConfirmationPOJO {
  /**
   * The unique identifier for the pickup. Indicates which pickup this cancellation
   * confirmation is for.
   */
  pickupID: string;

  /**
   * The carrier's cancellation number, if any
   */
  cancellationNumber?: string;

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
   * This description should not be specific to this particular pickup
   */
  errorDescription?: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  notes?: string;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * Confirmation that a shipment has been canceled
 */
export interface ShipmentCancellationConfirmationPOJO {
  /**
   * ShipEngine's unique identifier for the shipment. Indicates which shipment this cancellation
   * confirmation is for.
   */
  shipmentID: string;

  /**
   * Indicates whether the shipment was successfully canceled.
   * If the shipment was _not_ canceled, then the `notes` field should contain
   * information and/or instructions for the customer. (e.g. "Please call ###-#### to cancel")
   */
  successful: boolean;

  /**
   * The carrier's cancellation number, if any
   */
  cancellationNumber?: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  notes?: string;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

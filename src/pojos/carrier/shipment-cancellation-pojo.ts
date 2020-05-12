import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * Cancellation of a previously-created shipment
 */
export interface ShipmentCancellationPOJO extends ShipmentIdentifierPOJO {
  /**
   * ShipEngine's unique identifier for the shipment. This ID must be returned, along with a flag
   * indicating whether it was successfully canceled.
   */
  shipmentID: string;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}

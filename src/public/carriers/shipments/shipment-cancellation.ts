import type { UUID } from "../../common";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Cancellation of a previously-created shipment
 */
export interface ShipmentCancellationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The unique ID of this cancellation. This ID is used to correlate cancellations with outcomes.
   */
  cancellationID: UUID;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}


/**
 * Cancellation of a previously-created shipment
 */
export interface ShipmentCancellation extends ShipmentIdentifier {
  /**
   * The unique ID of this cancellation. This ID is used to correlate cancellations with outcomes.
   */
  readonly cancellationID: UUID;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}

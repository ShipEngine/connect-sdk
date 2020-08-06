import type { ShipmentIdentifier } from "../shipments/shipment-identifier";

/**
 * The information needed to request tracking information for a shipment
 */
export interface TrackingCriteria extends ShipmentIdentifier {
  /**
   * Return shipment details
   */
  readonly returns: {
    /**
     * Indicates whether this is a return shipment
     */
    readonly isReturn: boolean;
  };

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  readonly metadata: object;
}

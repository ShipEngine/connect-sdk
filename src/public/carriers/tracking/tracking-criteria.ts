import type { ShipmentIdentifier } from "../shipments/shipment-identifier";

/**
 * The information needed to request tracking information for a shipment
 */
export interface TrackingCriteria extends ShipmentIdentifier {
  /**
   * Return shipment details
   */
  returns: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn: boolean;
  };

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata: object;
}

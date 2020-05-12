import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * The information needed to request tracking information for a shipment
 */
export interface TrackingCriteriaPOJO extends ShipmentIdentifierPOJO {
  /**
   * Indicates whether this is a return shipment
   */
  isReturn?: boolean;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  metadata?: object;
}

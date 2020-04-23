import { ShipmentPOJO } from "./shipment-pojo";

/**
 * Specifies the criteria for tracking details
 */
export interface TrackingCriteriaPOJO {
  /**
   * The shipment to get tracking details for
   */
  shipment: ShipmentPOJO;
}

import { ShipmentPOJO } from "./shipment-pojo";

/**
 * Specifies the criteria for requesting tracking information about a shipment
 */
export interface TrackingCriteriaPOJO {
  /**
   * The shipment to get tracking information for
   */
  shipment: ShipmentPOJO;
}

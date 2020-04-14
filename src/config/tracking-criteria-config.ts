import { ShipmentConfig } from "./shipment-config";

/**
 * Specifies the criteria for tracking details
 */
export interface TrackingCriteriaConfig {
  /**
   * The shipment to get tracking details for
   */
  shipment: ShipmentConfig;
}

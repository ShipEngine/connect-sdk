import { NewShipmentConfig } from "./shipment-config";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteriaConfig {
  /**
   * The shipment information used to get rate quotes
   */
  shipment: NewShipmentConfig;
}

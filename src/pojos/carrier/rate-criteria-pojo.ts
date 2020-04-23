import { NewShipmentPOJO } from "./shipment-pojo";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteriaPOJO {
  /**
   * The shipment information used to get rate quotes
   */
  shipment: NewShipmentPOJO;
}

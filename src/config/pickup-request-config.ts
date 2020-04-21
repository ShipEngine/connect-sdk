import { UUID } from "../types";
import { AddressConfig } from "./address-config";
import { ContactInfoConfig } from "./contact-info-config";
import { ShipmentConfig } from "./shipment-config";
import { TimeRangeConfig } from "./time-range-config";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export interface PickupRequestConfig {
  /**
   * The ID of the requested pickup service
   */
  pickupServiceID: UUID;

  /**
   * The requested window of time for the carrier to arrive.
   */
  timeWindow: TimeRangeConfig;

  /**
   * The address where the packages should be picked up
   */
  address: AddressConfig;

  /**
   * Human-readable information about the pickup
   */
  notes?: string;

  /**
   * Contact information about the person there to meet the driver
   */
  contact: ContactInfoConfig;

  /**
   * The shipments to be picked up
   */
  shipments: ShipmentConfig[];
}

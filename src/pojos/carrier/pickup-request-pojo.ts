import { UUID } from "../../types";
import { AddressPOJO } from "../address-pojo";
import { ContactInfoPOJO } from "../contact-info-pojo";
import { TimeRangePOJO } from "../time-range-pojo";
import { ShipmentPOJO } from "./shipment-pojo";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export interface PickupRequestPOJO {
  /**
   * The ID of the requested pickup service
   */
  pickupServiceID: UUID;

  /**
   * The requested window of time for the carrier to arrive.
   */
  timeWindow: TimeRangePOJO;

  /**
   * The address where the packages should be picked up
   */
  address: AddressPOJO;

  /**
   * Human-readable information about the pickup
   */
  notes?: string;

  /**
   * Contact information about the person there to meet the driver
   */
  contact: ContactInfoPOJO;

  /**
   * The shipments to be picked up
   */
  shipments: ShipmentPOJO[];
}

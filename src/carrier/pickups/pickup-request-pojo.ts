import { AddressPOJO, ContactInfoPOJO, TimeRangePOJO } from "../../common";
import { UUID } from "../../types";
import { PickupShipmentPOJO } from "./pickup-shipment-pojo";

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
   * Contact information about the person there to meet the driver
   */
  contact: ContactInfoPOJO;

  /**
   * Human-readable information about the pickup
   */
  note?: string;

  /**
   * The shipments to be picked up
   */
  shipments: PickupShipmentPOJO[];
}

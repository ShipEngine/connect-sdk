import type { Address, ContactInfo, Note, TimeRange } from "../../common";
import type { PickupService } from "./pickup-service";
import type { PickupShipment } from "./pickup-shipment";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export interface PickupRequest {
  /**
   * The requested pickup service
   */
  pickupService: PickupService;

  /**
   * The requested window of time for the carrier to arrive.
   */
  timeWindow: TimeRange;

  /**
   * The address where the packages should be picked up
   */
  address: Address;

  /**
   * Contact information about the person there to meet the driver
   */
  contact: ContactInfo;

  /**
   * Additional information about the pickup
   */
  notes: Array<Note>;

  /**
   * The shipments to be picked up
   */
  shipments: Array<PickupShipment>;
}

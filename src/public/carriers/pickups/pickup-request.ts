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
  readonly pickupService: PickupService;

  /**
   * The requested window of time for the carrier to arrive.
   */
  readonly timeWindow: TimeRange;

  /**
   * The address where the packages should be picked up
   */
  readonly address: Address;

  /**
   * Contact information about the person there to meet the driver
   */
  readonly contact: ContactInfo;

  /**
   * Additional information about the pickup
   */
  readonly notes: readonly Note[];

  /**
   * The shipments to be picked up
   */
  readonly shipments: readonly PickupShipment[];
  
}

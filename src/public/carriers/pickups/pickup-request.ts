import type { Address, AddressPOJO, ContactInfo, ContactInfoPOJO, Note, NotePOJO, TimeRange, TimeRangePOJO } from "../../common";
import type { PickupService, PickupServiceIdentifierPOJO } from "./pickup-service";
import type { PickupShipment, PickupShipmentPOJO } from "./pickup-shipment";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export interface PickupRequestPOJO {
  /**
   * The requested pickup service
   */
  pickupService: PickupServiceIdentifierPOJO;

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
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * The shipments to be picked up
   */
  shipments: ReadonlyArray<PickupShipmentPOJO>;
}


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
  readonly notes: ReadonlyArray<Note>;

  /**
   * The shipments to be picked up
   */
  readonly shipments: ReadonlyArray<PickupShipment>;
}

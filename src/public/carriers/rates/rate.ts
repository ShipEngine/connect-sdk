import type { Charge, DateTimeZone, MonetaryValue, Note } from "../../common";
import type { DeliveryService } from "../delivery-service";
import type { RatePackage } from "./rate-package";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface Rate {
  /**
   * The delivery service this rate is for
   */
  deliveryService: DeliveryService;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime?: DateTimeZone;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  isNegotiatedRate: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: Array<Charge>;

  /**
   * The total cost of all charges for this rate
   */
  totalAmount: MonetaryValue;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  notes: Array<Note>;

  /**
   * The list of packages in the shipment
   */
  packages: Array<RatePackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: RatePackage;
}

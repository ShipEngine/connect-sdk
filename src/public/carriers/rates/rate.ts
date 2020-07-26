import type { Charge, ChargePOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue, Note, NotePOJO, TimeRange, TimeRangePOJO } from "../../common";
import type { DeliveryService, DeliveryServiceIdentifierPOJO } from "../delivery-service";
import type { FulfillmentService } from "../fulfillment-service";
import type { RatePackage, RatePackagePOJO } from "./rate-package";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface RatePOJO {
  /**
   * The delivery service this rate is for
   */
  deliveryService: DeliveryServiceIdentifierPOJO;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  isNegotiatedRate?: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable?: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ReadonlyArray<ChargePOJO>;

  /**
   * Human-readable information regarding this rate quote, such as limitations or restrictions
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<RatePackagePOJO>;
}


/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface Rate {
  /**
   * The delivery service this rate is for
   */
  readonly deliveryService: DeliveryService;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  readonly shipDateTime?: DateTimeZone;

  /**
   * The estimated date and time the shipment will be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  readonly isNegotiatedRate: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  readonly isTrackable: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this rate
   */
  readonly totalAmount: MonetaryValue;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  readonly notes: ReadonlyArray<Note>;

  /**
   * The list of packages in the shipment
   */
  readonly packages: ReadonlyArray<RatePackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: RatePackage;
}

import type { ChargePOJO, DateTimeZonePOJO, NotePOJO } from "../../common";
import type { DeliveryServiceIdentifierPOJO } from "../delivery-service";
import type { RatePackage } from "./rate-package";
import type { DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface Rate {
  /**
   * The delivery service this rate is for
   */
  deliveryService: DeliveryServiceIdentifierPOJO | string;

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
  charges: readonly ChargePOJO[];

  /**
   * Human-readable information regarding this rate quote, such as limitations or restrictions
   */
  notes?: NotePOJO[];

  /**
   * The list of packages in the shipment
   */
  packages?: readonly RatePackage[];

  /**
 * The delivery confirmation included in this rate
 */
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO | string;
}

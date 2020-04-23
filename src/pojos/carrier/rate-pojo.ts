import { UUID } from "../../types";
import { ShippingChargePOJO } from "./shipping-charge-pojo";

/**
 * Quoted shipping rates for the specified rate criteria
 */
export interface RateQuotePOJO {
  /**
   * A list of rates that match the specified rate criteria
   */
  rates: RatePOJO[];
}

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface RatePOJO {
  /**
   * The ID of the delivery service this rate is for
   */
  deliveryServiceID: UUID;

  /**
   * The ID of the delivery confirmation included in this rate
   */
  deliveryConfirmationID?: UUID;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime?: Date;

  /**
   * The estimated date and time the shipment will be delivered
   */
  estimatedDeliveryDateTime?: Date;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ShippingChargePOJO[];

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  isNegotiatedRate?: boolean;

  /**
   * Human-readable information regarding this rate quote, such as limitations or restrictions
   */
  notes?: string | string[];
}

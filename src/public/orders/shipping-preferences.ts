import type { DateTimeZone, DeliveryConfirmationType, MonetaryValue } from "../common";

/**
 * Preferences about how a sales order or item should be shipped
 */
export interface ShippingPreferences {
  /**
   * The requested delivery confirmation
   */
  deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * The date and time that the shipment should be delivered
   */
  deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  containsAlcohol: boolean;

  /**
   * Indicates whether Saturday delivery is reqeusted
   */
  saturdayDelivery: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  insuredValue?: MonetaryValue;
}

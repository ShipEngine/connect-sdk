import type { DateTimeZone, DateTimeZonePOJO, DeliveryConfirmationType, MonetaryValue, MonetaryValuePOJO } from "../common";


/**
 * Preferences about how a sales order or item should be shipped
 */
export interface ShippingPreferencesPOJO {
  /**
   * The requested delivery confirmation
   */
  deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * The date and time that the shipment should be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * Indicates whether expedited shipping is requested
   */
  expeditedService?: boolean;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether Saturday delivery is reqeusted
   */
  saturdayDelivery?: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  insuredValue?: MonetaryValuePOJO;
}


/**
 * Preferences about how a sales order or item should be shipped
 */
export interface ShippingPreferences {
  /**
   * The requested delivery confirmation
   */
  readonly deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * The date and time that the shipment should be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether expedited shipping is requested
   */
  readonly expeditedService: boolean;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  readonly containsAlcohol: boolean;

  /**
   * Indicates whether Saturday delivery is reqeusted
   */
  readonly saturdayDelivery: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  readonly insuredValue?: MonetaryValue;
}

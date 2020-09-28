import type { DateTimeZonePOJO, DeliveryConfirmationType, MonetaryValuePOJO } from "../common";


/**
 * Preferences about how a sales order or item should be shipped
 */
export interface ShippingPreferences {
  /**
   * The requested delivery confirmation
   */
  deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether Saturday delivery is requested
   */
  saturdayDelivery?: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  insuredValue?: MonetaryValuePOJO;

  /**
   * The requested shipping service to be used.
   */
  requestedShippingService?: string;

  /**
   * The requested date for the sales order to be delivered by.
   */
  deliveryByDate?: DateTimeZonePOJO | Date | string;
}

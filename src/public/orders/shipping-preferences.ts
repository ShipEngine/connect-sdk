import type { DateTimeZonePOJO, DeliveryConfirmationType, MonetaryValuePOJO } from "../common";
import { OrderSourcePolicies } from "./order-source-policies";


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
   * Indicates whether the item has been marked as a gift
   */
  isGift?: boolean;

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
  deliverByDate?: DateTimeZonePOJO | Date | string;


  /**
   * The requested date for the fulfillment to be shipped by.
   */
  shipByDate?: DateTimeZonePOJO | Date | string;


  /**
   * The requested policies for the requested fulfillment
   */
  orderSourcePolicies?: OrderSourcePolicies;

  /**
   * The warehouse name associated with the requested warehouse.
   */
  requestedWarehouse?: string;
}

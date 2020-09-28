import type { AddressWithContactInfoPOJO, DateTimeZonePOJO, NotePOJO, URLString, Charge } from "../common";
import type { Buyer } from "./buyer";
import type { PaymentMethod, PaymentStatus, SalesOrderStatus } from "./enums";
import type { SalesOrderIdentifierPOJO } from "./sales-order-identifier";
import type { SalesOrderItem } from "./sales-order-item";
import type { ShippingPreferences } from "./shipping-preferences";

/**
 * A sales order
 */
export interface SalesOrder extends SalesOrderIdentifierPOJO {
  /**
   * The date/time that the sales order was originally placed
   */
  createdDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The current status
   */
  status: SalesOrderStatus;

  /**
   * Indicates how the customer has paid for the order
   */
  paymentMethod?: PaymentMethod;

  /**
   * Indicates what the status of the customer payment for this order is.
   */
  paymentStatus?: PaymentStatus;

  /**
   * The URL of a webpage where the customer can view the order
   */
  orderURL?: URLString | URL;
  
  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  buyer: Buyer;
  
  /**
   * The breakdown of charges for this sales order
   */
  charges?: Charge[];
  
  
  requestedFulfillments: Array<{
    /**
     * The items in this fulfillment request
     */
    items: readonly SalesOrderItem[];
    
    /**
     * Shipping preferences for this order fulfillment
     */
    shippingPreferences?: ShippingPreferences;
    
    /**
     * The address where the sales order item should be shipped
     */
    shipTo: AddressWithContactInfoPOJO;
  }>;

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  notes?: NotePOJO[];

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Connect.
   * Must be JSON serializable.
   */
  metadata?: object;
}

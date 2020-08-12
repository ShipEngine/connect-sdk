import type { AddressWithContactInfoPOJO, ChargePOJO, DateTimeZonePOJO, NotePOJO, URLString } from "../common";
import type { Buyer } from "./buyer";
import type { PaymentMethod, SalesOrderStatus } from "./enums";
import type { SalesOrderIdentifierPOJO } from "./sales-order-identifier";
import type { SalesOrderItem } from "./sales-order-item";
import type { ShippingPreferences } from "./shipping-preferences";
import { SalesOrderCharges } from "./sales-order-charges";

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
   * The URL of a webpage where the customer can view the order
   */
  orderURL?: URLString | URL;

  /**
   * The address where the order should be shipped
   */
  shipTo: AddressWithContactInfoPOJO;

  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  buyer: Buyer;

  /**
   * Preferences on how this order should be fulfilled
   */
  shippingPreferences?: ShippingPreferences;

  /**
   * The breakdown of adjustments for this sales order
   */
  adjustments?: readonly ChargePOJO[];

  /**
   * The breakdown of charges for this sales order
   */
  charges?: SalesOrderCharges;

  /**
   * The items in this sales order
   */
  items: readonly SalesOrderItem[];

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

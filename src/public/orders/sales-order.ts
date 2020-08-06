import type { AddressWithContactInfoPOJO, ChargePOJO, DateTimeZonePOJO, NotePOJO, URLString } from "../common";
import type { Buyer } from "./buyer";
import type { PaymentMethod, SalesOrderStatus } from "./enums";
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
   * The date/time that the sales order was last updated. Defaults to the `createdDateTime`.
   */
  modifiedDateTime?: DateTimeZonePOJO | Date | string;

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
   * The breakdown of charges for this sales order
   */
  charges?: readonly ChargePOJO[];

  /**
   * The items in this sales order
   */
  items: readonly SalesOrderItem[];

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

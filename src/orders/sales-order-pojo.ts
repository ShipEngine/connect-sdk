import { AddressWithContactInfoPOJO, ChargePOJO, DateTimeZonePOJO, NotePOJO, URLString } from "../common";
import { BuyerPOJO } from "./buyer";
import { FulfillmentStatus, PaymentMethod, PaymentStatus, SalesOrderStatus } from "./enums";
import { SalesOrderIdentifierPOJO } from "./sales-order-identifier";
import { SalesOrderItemPOJO } from "./sales-order-item-pojo";
import { SellerIdentifierPOJO } from "./sellers/seller-identifier";
import { ShippingPreferencesPOJO } from "./shipping-preferences";

/**
 * A sales order
 */
export interface SalesOrderPOJO extends SalesOrderIdentifierPOJO {
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
   * Indicates whether the order has been fulfilled
   */
  fulfillmentStatus?: FulfillmentStatus;

  /**
   * Indicates whether the customer has paid for the order
   */
  paymentStatus?: PaymentStatus;

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
   * Identifies the seller who sold the order
   */
  seller: SellerIdentifierPOJO;

  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  buyer: BuyerPOJO;

  /**
   * Preferences on how this order should be fulfilled
   */
  shippingPreferences?: ShippingPreferencesPOJO;

  /**
   * The breakdown of charges for this sales order
   */
  charges: ReadonlyArray<ChargePOJO>;

  /**
   * The items in this sales order
   */
  items: ReadonlyArray<SalesOrderItemPOJO>;

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

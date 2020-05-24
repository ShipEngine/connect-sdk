import type { AddressWithContactInfo, AddressWithContactInfoPOJO, Charge, ChargePOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue, Note, NotePOJO, URLString } from "../common";
import type { Buyer, BuyerPOJO } from "./buyer";
import type { FulfillmentStatus, PaymentMethod, PaymentStatus, SalesOrderStatus } from "./enums";
import type { SalesOrderIdentifier, SalesOrderIdentifierPOJO } from "./sales-order-identifier";
import type { SalesOrderItem, SalesOrderItemPOJO } from "./sales-order-item";
import type { SellerIdentifier, SellerIdentifierPOJO } from "./sellers/seller-identifier";
import type { ShippingPreferences, ShippingPreferencesPOJO } from "./shipping-preferences";

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
  charges?: ReadonlyArray<ChargePOJO>;

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


/**
 * A sales order
 */
export interface SalesOrder extends SalesOrderIdentifier {
  /**
   * The date/time that the sales order was originally placed
   */
  readonly createdDateTime: DateTimeZone;

  /**
   * The date/time that the sales order was last updated.
   */
  readonly modifiedDateTime: DateTimeZone;

  /**
   * The current status
   */
  readonly status: SalesOrderStatus;

  /**
   * Indicates whether the order has been fulfilled
   */
  readonly fulfillmentStatus?: FulfillmentStatus;

  /**
   * Indicates whether the customer has paid for the order
   */
  readonly paymentStatus?: PaymentStatus;

  /**
   * Indicates how the customer has paid for the order
   */
  readonly paymentMethod?: PaymentMethod;

  /**
   * The URL of a webpage where the customer can view the order
   */
  readonly orderURL?: URL;

  /**
   * The address where the order should be shipped
   */
  readonly shipTo: AddressWithContactInfo;

  /**
   * Identifies the seller who sold the order
   */
  readonly seller: SellerIdentifier;

  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  readonly buyer: Buyer;

  /**
   * Preferences on how this order should be fulfilled
   */
  readonly shippingPreferences: ShippingPreferences;

  /**
   * The breakdown of charges for this sales order
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this sales order
   */
  readonly totalCharges: MonetaryValue;

  /**
   * The total amount of the order. This is `totalCharges` plus the `totalAmount`
   * of all items in the order.
   */
  readonly totalAmount: MonetaryValue;

  /**
   * The items in this sales order
   */
  readonly items: ReadonlyArray<SalesOrderItem>;

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}

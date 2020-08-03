import type { AddressWithContactInfo, Charge, DateTimeZone, MonetaryValue, Note } from "../common";
import type { Buyer } from "./buyer";
import type { PaymentMethod, SalesOrderStatus } from "./enums";
import type { SalesOrderIdentifier } from "./sales-order-identifier";
import type { SalesOrderItem } from "./sales-order-item";
import type { ShippingPreferences } from "./shipping-preferences";

/**
 * A sales order
 */
export interface SalesOrder extends SalesOrderIdentifier {
  /**
   * The date/time that the sales order was originally placed
   */
  createdDateTime: DateTimeZone;

  /**
   * The date/time that the sales order was last updated.
   */
  modifiedDateTime: DateTimeZone;

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
  orderURL?: URL;

  /**
   * The address where the order should be shipped
   */
  shipTo: AddressWithContactInfo;

  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  buyer: Buyer;

  /**
   * Preferences on how this order should be fulfilled
   */
  shippingPreferences: ShippingPreferences;

  /**
   * The breakdown of charges for this sales order
   */
  charges: Array<Charge>;

  /**
   * The total cost of all charges for this sales order
   */
  totalCharges: MonetaryValue;

  /**
   * The items in this sales order
   */
  items: Array<SalesOrderItem>;

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  notes: Array<Note>;

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata: object;
}

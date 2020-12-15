import type { DateTimeZonePOJO, NotePOJO, URLString, Charge } from "../common";
import type { Buyer } from "./buyer";
import type { PaymentMethod, PaymentStatus, SalesOrderStatus } from "./enums";
import { OriginalOrderSource } from "./original-order-source";
import { RequestedFulfillmentPOJO } from "./requested-fulfillment";
import type { SalesOrderIdentifierPOJO } from "./sales-order-identifier";

/**
 * A sales order
 */
export interface SalesOrder extends SalesOrderIdentifierPOJO {
  /**
   * The date/time that the sales order was originally placed
   */
  createdDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The date/time that the sales order was last modified
   */
  lastModifiedDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The current status
   */
  status: SalesOrderStatus;

  /**
   * Indicates how the customer has paid for the order
   */
  paymentMethod?: PaymentMethod | string;

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
  
  
  requestedFulfillments: Array<RequestedFulfillmentPOJO>;

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  notes?: NotePOJO[];

  /**
   * Information regarding the original order source.
   */
  originalOrderSource?: OriginalOrderSource;

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Connect.
   * Must be JSON serializable.
   */
  metadata?: object;
}

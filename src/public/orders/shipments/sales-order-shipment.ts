import { ShipmentIdentifier } from "../../carriers";
import type { AddressWithContactInfo, DateTimeZone } from "../../common";
import { SalesOrderPackageItem } from "./sales-order-package-item";
import type { SalesOrderIdentifier } from "../../orders";


/**
 * A shipment that fulfills all or part of one or more sales orders
 */
export interface SalesOrderShipment extends ShipmentIdentifier {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  readonly trackingURL?: URL;

  /**
   * The sales order associated with this shipment
   */
  readonly salesOrder: SalesOrderIdentifier;

  /**
   * The code for the carrier that is being used to fulfill the sales order
   */
  readonly carrierCode?: string;

  /**
   * The code for the carrier service that is being used to fulfill the sales order.
   */
  readonly carrierServiceCode?: string;
  
  /**
   * The sender's contact info and address
   */
  readonly shipFrom?: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  readonly shipTo: AddressWithContactInfo;

  /**
   * The date/time that the shipment was shipped or is expected to ship.
   * This is not guaranteed to be in the future.
   */
  readonly shipDateTime: DateTimeZone;

  /**
   * Describes the items inside the package
   */
  readonly contents: readonly SalesOrderPackageItem[];
}

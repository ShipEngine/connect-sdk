import { ShipmentIdentifier } from "../../carriers";
import type { AddressWithContactInfo, DateTimeZone } from "../../common";
import { SalesOrderPackageItem } from "./sales-order-package-item";

/**
 * A shipment that fulfills all or part of one or more sales orders
 */
export interface SalesOrderShipment extends ShipmentIdentifier {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URL;

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then this field specifies the carrier service.
   */
  fulfillmentService?: string;

  /**
   * The sender's contact info and address
   */
  shipFrom?: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfo;

  /**
   * The date/time that the shipment was shipped or is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZone;

  /**
   * Describes the items inside the package
   */
  contents: Array<SalesOrderPackageItem>;
}

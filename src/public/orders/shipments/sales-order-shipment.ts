import { FulfillmentService, ShipmentIdentifier, ShipmentIdentifierPOJO } from "../../carriers";
import type { AddressWithContactInfo, AddressWithContactInfoPOJO, DateTimeZone, DateTimeZonePOJO, TimeRange, TimeRangePOJO, URLString } from "../../common";
import { SalesOrderPackage, SalesOrderPackagePOJO } from "./sales-order-package";

/**
 * A shipment that fulfills all or part of one or more sales orders
 */
export interface SalesOrderShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URLString | URL;

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then this field specifies the carrier service.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfoPOJO;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfoPOJO;

  /**
   * The date/time that the shipment was shipped or is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The minimum number of days delivery will take
   */
  minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  deliveryWindow?: TimeRangePOJO;

  /**
   * The packages in the shipment
   */
  packages: ReadonlyArray<SalesOrderPackagePOJO>;
}


/**
 * A shipment that fulfills all or part of one or more sales orders
 */
export interface SalesOrderShipment extends ShipmentIdentifier {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  readonly trackingURL?: URL;

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then this field specifies the carrier service.
   */
  readonly fulfillmentService?: FulfillmentService;

  /**
   * The sender's contact info and address
   */
  readonly shipFrom: AddressWithContactInfo;

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
   * The estimated date and time the shipment will be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * The minimum number of days delivery will take
   */
  readonly minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  readonly maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  readonly deliveryWindow?: TimeRange;

  /**
   * The packages in the shipment
   */
  readonly packages: ReadonlyArray<SalesOrderPackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: SalesOrderPackage;
}

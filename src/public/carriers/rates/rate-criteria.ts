import type { AddressWithContactInfo, DateTimeZone, MonetaryValue } from "../../common";
import type { DeliveryService } from "../delivery-service";
import type { FulfillmentService } from "../fulfillment-service";
import type { PackageRateCriteria } from "./package-rate-criteria";
import type { DeliveryConfirmation } from "../delivery-confirmation";
import { ShippingOptions } from "../shipping-options";


/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteria {
  /**
   * The delivery services that may be used. If neither `deliveryService` nor
   * `fulfillmentService` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  readonly deliveryService?: DeliveryService;

  /**
   * Well-known carrier services that may be used to fulfill the shipment.
   * If neither `deliveryService` nor `fulfillmentService` are specified, then rate quotes
   * should be returned for all applicable services.
   */
  readonly fulfillmentService?: FulfillmentService;

  /**
   * The delivery confirmation that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  readonly deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  readonly shipDateTime: DateTimeZone;

  /**
   * The latest date and time that the shipment can be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * The sender's contact info and address
   */
  readonly shipFrom: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  readonly shipTo: AddressWithContactInfo;

  /**
   * The total insured value of all packages in the shipment.
   * If specified, then rate quotes should include carrier-provided insurance.
   */
  readonly totalInsuredValue?: MonetaryValue;

  /**
   * Return shipment details
   */
  readonly returns: {
    /**
     * Indicates whether this is a return shipment
     */
    readonly isReturn: boolean;
  };

  /**
   * The list of packages in the shipment
   */
  readonly packages: readonly PackageRateCriteria[];

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PackageRateCriteria;

  /**
   * Custom carrier shipping options for creating rates.
   */
  readonly shippingOptions?: ShippingOptions;

}

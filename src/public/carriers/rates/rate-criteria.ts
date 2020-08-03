import type { AddressWithContactInfo, DateTimeZone, MonetaryValue } from "../../common";
import type { DeliveryService } from "../delivery-service";
import type { PackageRateCriteria } from "./package-rate-criteria";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteria {
  /**
   * The delivery services that may be used. If neither `deliveryService` nor
   * `fulfillmentService` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  deliveryService?: DeliveryService;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZone;

  /**
   * The latest date and time that the shipment can be delivered
   */
  deliveryDateTime?: DateTimeZone;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfo;

  /**
   * The total insured value of all packages in the shipment.
   * If specified, then rate quotes should include carrier-provided insurance.
   */
  totalInsuredValue?: MonetaryValue;

  /**
   * Return shipment details
   */
  returns: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn: boolean;
  };

  /**
   * The list of packages in the shipment
   */
  packages: Array<PackageRateCriteria>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: PackageRateCriteria;
}

import type { AddressWithContactInfo, AddressWithContactInfoPOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue } from "../../common";
import type { DeliveryService, DeliveryServiceIdentifierPOJO } from "../delivery-service";
import type { FulfillmentService } from "../fulfillment-service";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import type { PackageRateCriteria, PackageRateCriteriaPOJO } from "./package-rate-criteria";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteriaPOJO {
  /**
   * The delivery service that may be used. If neither `deliveryService` nor
   * `fulfillmentService` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  deliveryService?: DeliveryServiceIdentifierPOJO | string;

  /**
   * Well-known carrier services that may be used to fulfill the shipment.
   * If neither `deliveryService` nor `fulfillmentService` are specified, then rate quotes
   * should be returned for all applicable services.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The latest date and time that the shipment can be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfoPOJO;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfoPOJO;

  /**
   * Return shipment details. If `undefined`, then it is assumed that the shipment is not a return.
   */
  returns?: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn?: boolean;
  };

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<PackageRateCriteriaPOJO>;
}


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
  readonly packages: ReadonlyArray<PackageRateCriteria>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PackageRateCriteria;
}

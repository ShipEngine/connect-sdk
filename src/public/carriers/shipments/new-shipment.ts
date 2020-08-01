import type { AddressWithContactInfo, AddressWithContactInfoPOJO, Country, DateTimeZone, DateTimeZonePOJO, MonetaryValue } from "../../common";
import type { DeliveryService, DeliveryServiceIdentifierPOJO } from "../delivery-service";
import type { NewPackage, NewPackagePOJO } from "../packages/new-package";

/**
 * The information needed to create a new shipment
 */
export interface NewShipmentPOJO {
  /**
   * The delivery service to use for the shipment
   */
  deliveryService: DeliveryServiceIdentifierPOJO | string;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfoPOJO;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfoPOJO;

  /**
   * The return address. Defaults to the `shipFrom` address
   */
  returnTo?: AddressWithContactInfoPOJO;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZonePOJO | Date | string;

  /**
   * Return shipment details. If `undefined`, then it is assumed that the shipment is not a return.
   */
  returns?: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn?: boolean;

    /**
     * A return merchandise authorization (RMA) is an associated number assigned to process the return,
     * this number is often printed on the label, and used when the original shipper processes the inbound return.
     */
    rmaNumber?: string;
  };

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<NewPackagePOJO>;
}


/**
 * The information needed to create a new shipment
 */
export interface NewShipment {
  /**
   * The delivery service to use
   */
  readonly deliveryService: DeliveryService;

  /**
   * The sender's contact info and address
   */
  readonly shipFrom: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  readonly shipTo: AddressWithContactInfo;

  /**
   * The return address
   */
  readonly returnTo: AddressWithContactInfo;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  readonly shipDateTime: DateTimeZone;

  /**
   * The total insured value of all packages in the shipment
   */
  readonly totalInsuredValue: MonetaryValue;

  /**
   * Indicates whether the shipment cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   *
   * This property is `true` if any package in the shipment is non-machinable.
   */
  readonly isNonMachinable: boolean;

  /**
   * Return shipment details
   */
  readonly returns: {
    /**
     * Indicates whether this is a return shipment
     */
    readonly isReturn: boolean;

    /**
     * A return merchandise authorization (RMA) is an associated number assigned to process the return,
     * this number is often printed on the label, and used when the original shipper processes the inbound return.
     */
    readonly rmaNumber: string;
  };

  /**
   * The list of packages in the shipment
   */
  readonly packages: ReadonlyArray<NewPackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: NewPackage;
}

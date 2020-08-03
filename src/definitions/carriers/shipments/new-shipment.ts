import type { AddressWithContactInfo, DateTimeZone, MonetaryValue } from "../../common";
import type { DeliveryService } from "../delivery-service";
import type { NewPackage } from "../packages/new-package";

/**
 * The information needed to create a new shipment
 */
export interface NewShipment {
  /**
   * The delivery service to use
   */
  deliveryService: DeliveryService;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfo;

  /**
   * The return address
   */
  returnTo: AddressWithContactInfo;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZone;

  /**
   * The total insured value of all packages in the shipment
   */
  totalInsuredValue: MonetaryValue;

  /**
   * Indicates whether the shipment cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   *
   * This property is `true` if any package in the shipment is non-machinable.
   */
  isNonMachinable: boolean;

  /**
   * Return shipment details
   */
  returns: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn: boolean;

    /**
     * A return merchandise authorization (RMA) is an associated number assigned to process the return,
     * this number is often printed on the label, and used when the original shipper processes the inbound return.
     */
    rmaNumber: string;
  };

  /**
   * The list of packages in the shipment
   */
  packages: Array<NewPackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: NewPackage;
}

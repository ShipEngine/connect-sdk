import { AddressWithContactInfoPOJO, DateTimeZonePOJO } from "../../common";
import { UUID } from "../../types";
import { FulfillmentService } from "../fulfillment-service";
import { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";
import { PackageRateCriteriaPOJO } from "./package-rate-criteria-pojo";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteriaPOJO {
  /**
   * The IDs of the delivery services that may be used. If neither `deliveryServices` nor
   * `fulfillmentServices` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  deliveryServiceIDs?: UUID[];

  /**
   * Well-known carrier services that may be used to fulfill the shipment.
   * If neither `deliveryServices` nor `fulfillmentServices` are specified, then rate quotes
   * should be returned for all applicable services.
   */
  fulfillmentServices?: FulfillmentService[];

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

    /**
     * The original (outgoing) shipment that this return shipment is for.
     * This associates the two shipments, which is required by some carriers.
     */
    outboundShipment?: ShipmentIdentifierPOJO;
  };

  /**
   * The list of packages in the shipment
   */
  packages: PackageRateCriteriaPOJO[];
}

import { FulfillmentService } from "../../enums";
import { UUID } from "../../types";
import { AddressWithContactInfoPOJO, DateTimeZonePOJO, DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";

/**
 * Specifies the criteria for rate quotes
 */
export interface RateCriteriaPOJO {
  /**
   * The IDs of the delivery services that may be used. If neither `deliveryServices` nor
   * `fulfillmentServices` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  deliveryServices?: UUID[];

  /**
   * The IDs of the packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  packaging?: UUID[];

  /**
   * The IDs of the delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  deliveryConfirmations?: UUID[];

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
   * Indicates whether this is a return shipment
   */
  isReturn?: boolean;

  /**
   * The original (outgoing) shipment that this return shipment is for.
   * This associates the two shipments, which is required by some carriers.
   */
  outboundShipment?: ShipmentIdentifierPOJO;

  /**
   * The list of packages in the shipment
   */
  packages: RateCriteriaPackagePOJO[];
}

/**
 * The package details needed for a rate quote
 */
export interface RateCriteriaPackagePOJO {
  /**
   * The package dimensions
   */
  dimensions?: DimensionsPOJO;

  /**
   * The package weight
   */
  weight?: WeightPOJO;

  /**
   * The insured value of this package.
   * If specified, then rate quotes should include carrier-provided insurance.
   */
  insuredValue?: MonetaryValuePOJO;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachineable?: boolean;
}

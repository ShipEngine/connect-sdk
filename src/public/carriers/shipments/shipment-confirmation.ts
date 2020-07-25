import type { Charge, ChargePOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue } from "../../common";
import type { PackageConfirmation, PackageConfirmationPOJO } from "../packages/package-confirmation";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ReadonlyArray<ChargePOJO>;

  /**
   * Confirmation details about each package in the shipment
   */
  packages: ReadonlyArray<PackageConfirmationPOJO>;

}


/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmation extends ShipmentIdentifier {

  /**
   * The estimated date and time the shipment will be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether tracking numbers are provided
   */
  readonly isTrackable: boolean;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this label
   */
  readonly totalAmount: MonetaryValue;

  /**
   * Confirmation details about each package in the shipment
   */
  readonly packages: ReadonlyArray<PackageConfirmation>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PackageConfirmation;

}

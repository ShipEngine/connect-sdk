import type { Charge, DateTimeZone, MonetaryValue } from "../../common";
import type { Document } from "../documents/document";
import type { Label } from "../documents/label";
import type { PackageConfirmation } from "../packages/package-confirmation";
import type { ShipmentIdentifier } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmation extends ShipmentIdentifier {
  /**
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  documents: Array<Document | Label>;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable: boolean;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: Array<Charge>;

  /**
   * The total cost of all charges for this label
   */
  totalAmount: MonetaryValue;

  /**
   * Confirmation details about each package in the shipment
   */
  packages: Array<PackageConfirmation>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  package: PackageConfirmation;

  /**
   * The first document of type "label" in the `documents` array
   */
  label: Label | undefined;

  /**
   * The first document of type "customs_form" in the `documents` array
   */
  customsForm: Document | undefined;

}

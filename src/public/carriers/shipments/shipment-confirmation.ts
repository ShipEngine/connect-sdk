import type { Charge, ChargePOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue } from "../../common";
import type { Document, DocumentPOJO } from "../documents/document";
import type { Label, LabelPOJO } from "../documents/label";
import type { PackageConfirmation, PackageConfirmationPOJO } from "../packages/package-confirmation";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "./shipment-identifier";
/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  documents: ReadonlyArray<DocumentPOJO | LabelPOJO>;

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
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  readonly documents: ReadonlyArray<Document | Label>;

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

  /**
   * The first document of type "label" in the `documents` array
   */
  readonly label: Label | undefined;

  /**
   * The first document of type "customs_form" in the `documents` array
   */
  readonly customsForm: Document | undefined;

}

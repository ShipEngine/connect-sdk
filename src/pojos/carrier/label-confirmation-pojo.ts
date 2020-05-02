import { DocumentFormat, DocumentSize } from "../../enums";
import { CustomDataPOJO } from "../common";
import { PackageIdentifierPOJO } from "./package-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-pojo";
import { ShippingChargePOJO } from "./shipping-charge-pojo";

/**
 * Confirms the successful creation of a shipping label
 */
export interface LabelConfirmationPOJO {
  /**
   * The carrier's confirmation ID for this transaction
   */
  confirmationID?: string;

  /**
   * The breakdown of charges in the total shipping cost for this label.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ShippingChargePOJO[];

  /**
   * Confirmation details about the shipment and its packages
   */
  shipment: ShipmentConfirmationPOJO;
}

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The estimated date and time the shipment will be delivered
   */
  estimatedDeliveryDateTime?: Date;

  /**
   * Confirmation details about each package in the shipment
   */
  packages: PackageConfirmationPOJO[];

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  customData?: CustomDataPOJO;
}

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmationPOJO extends PackageIdentifierPOJO {
  /**
   * The shipping label for this package
   */
  label: DocumentPOJO;

  /**
   * The customs form for this package
   */
  customsForm?: DocumentPOJO;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  customData?: CustomDataPOJO;
}

/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export interface DocumentPOJO {
  /**
   * The dimensions of the document
   */
  size: DocumentSize;

  /**
   * The file format of the document
   */
  format: DocumentFormat;

  /**
   * The document data, in the specified file format
   */
  data: Buffer;
}

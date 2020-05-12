import { FulfillmentService } from "../../enums";
import { URLString } from "../../types";
import { DateTimeZonePOJO } from "../common";
import { DocumentPOJO } from "./document-pojo";
import { PackageIdentifierPOJO } from "./package-identifier-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";
import { ShippingChargePOJO } from "./shipping-charge-pojo";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URLString | URL;

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify the carrier service here.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ShippingChargePOJO[];

  /**
   * Confirmation details about each package in the shipment
   */
  packages: PackageConfirmationPOJO[];

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmationPOJO extends PackageIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

  /**
   * The shipping label for this package
   */
  label: DocumentPOJO;

  /**
   * The customs form for this package
   */
  customsForm?: DocumentPOJO;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

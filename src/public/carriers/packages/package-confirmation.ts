import type { URLString } from "../../common";
import type { Document, DocumentPOJO } from "../documents/document";
import type { Label, LabelPOJO } from "../documents/label";
import type { PackageIdentifier, PackageIdentifierPOJO } from "./package-identifier";

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmationPOJO extends PackageIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

  /**
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  documents: ReadonlyArray<DocumentPOJO | LabelPOJO>;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmation extends PackageIdentifier {
  /**
   * The URL of a webpage where the customer can track the package
   */
  readonly trackingURL?: URL;

  /**
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  readonly documents: ReadonlyArray<Document | Label>;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;

  /**
   * The first document of type "label" in the `documents` array
   */
  readonly label: Label | undefined;

  /**
   * The first document of type "customs_form" in the `documents` array
   */
  readonly customsForm: Document | undefined;
}

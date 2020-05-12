import { IdentifierPOJO } from "../common";
import { DocumentPOJO } from "./document-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * Confirmation that an end-of-day manifest has been created
 */
export interface ManifestConfirmationPOJO {
  /**
   * The carrier's manifest number, if any
   */
  manifestNumber?: string;

  /**
   * Alternative identifiers associated with this manifest
   */
  identifiers?: IdentifierPOJO[];

  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  shipments?: ShipmentIdentifierPOJO[];

  /**
   * The digital manifst document, such as a PDF SCAN form
   */
  document?: DocumentPOJO;

  /**
   * Human-readable information about the manifest
   */
  notes?: string;

  /**
   * Arbitrary data about this manifest that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

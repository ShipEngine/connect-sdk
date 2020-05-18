import { IdentifiersPOJO, NotePOJO } from "../../common";
import { DocumentPOJO } from "../documents/document-pojo";
import { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * An end-of-day manifest
 */
export interface ManifestPOJO {
  /**
   * The carrier's manifest ID, if any
   */
  id?: string;

  /**
   * Your own identifiers for this manifest
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The shipments that are included on this manifest.
   */
  shipments: ReadonlyArray<ShipmentIdentifierPOJO>;

  /**
   * The digital manifst document, such as a PDF SCAN form
   */
  document?: DocumentPOJO;

  /**
   * Human-readable information about the manifest
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * Arbitrary data about this manifest that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}

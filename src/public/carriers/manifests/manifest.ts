import type { Identifiers, IdentifiersPOJO, Note, NotePOJO } from "../../common";
import type { Document, DocumentPOJO } from "../documents/document";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

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
   * The digital manifest document, such as a PDF SCAN form
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


/**
 * An end-of-day manifest
 */
export interface Manifest {
  /**
   * The carrier's manifest ID, if any
   */
  readonly id: string;

  /**
   * Your own identifiers for this manifest
   */
  readonly identifiers: Identifiers;

  /**
   * The shipments that are included on this manifest.
   */
  readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * The digital manifst document, such as a PDF SCAN form
   */
  readonly document?: Document;

  /**
   * Human-readable information about the manifest
   */
  readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this manifest that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}

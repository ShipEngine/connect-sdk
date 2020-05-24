import type { Manifest, ManifestPOJO } from "./manifest";
import type { NonManifestedShipment, NonManifestedShipmentPOJO } from "./non-manifested-shipment";

/**
 * Confirmation that an end-of-day manifest has been created
 */
export interface ManifestConfirmationPOJO {
  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  manifests: ReadonlyArray<ManifestPOJO>;

  /**
   * An array of the shipments that could not be manifested, and why
   */
  notManifested?: ReadonlyArray<NonManifestedShipmentPOJO>;
}


/**
 * Confirmation that an end-of-day manifest has been created
 */
export interface ManifestConfirmation {
  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  readonly manifests: ReadonlyArray<Manifest>;

  /**
   * An array of the shipments that could not be manifested, and why
   */
  readonly notManifested: ReadonlyArray<NonManifestedShipment>;
}

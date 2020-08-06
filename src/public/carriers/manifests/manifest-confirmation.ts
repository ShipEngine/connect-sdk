import type { Manifest } from "./manifest";
import type { NonManifestedShipment } from "./non-manifested-shipment";

/**
 * Confirmation that an end-of-day manifest has been created
 */
export interface ManifestConfirmation {
  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  manifests: readonly Manifest[];

  /**
   * An array of the shipments that could not be manifested, and why
   */
  notManifested?: readonly NonManifestedShipment[];
}

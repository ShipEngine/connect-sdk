import type { Identifiers } from "../../common";

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifier {
  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the package tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  trackingNumber: string;

  /**
   * Your own identifiers for this shipment
   */
  identifiers: Identifiers;
}

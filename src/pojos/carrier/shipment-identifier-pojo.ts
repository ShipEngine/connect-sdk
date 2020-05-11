import { IdentifierPOJO } from "../common";

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifierPOJO {
  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the package tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  trackingNumber?: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  identifiers?: IdentifierPOJO[];
}

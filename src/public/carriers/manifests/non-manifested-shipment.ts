import type { NotePOJO } from "../../common";
import type { ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * A shipment that could not be manifested, along with details about why
 */
export interface NonManifestedShipment extends ShipmentIdentifierPOJO {
  /**
   * The carrier's error code
   */
  code?: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment.
   */
  description?: string;

  /**
   * Human-readable information regarding the error, such as details that are specific
   * to this particular shipment
   */
  notes?: NotePOJO[];
}

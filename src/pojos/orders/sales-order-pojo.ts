import { Identifier } from "../../types";

/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The vendor's unique ID for the order
   */
  salesOrderID: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  identifiers?: Identifier[];
}

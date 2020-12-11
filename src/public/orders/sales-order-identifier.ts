import type { Identifiers, IdentifiersPOJO } from "../common";


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The marketplace's unique ID for the sales order
   */
  id: string;

  /**
   * The customer facing identifier of the sales order
   */
  orderNumber?: string;

  /**
   * Your own identifiers for this sales order
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifier {
  /**
   * The marketplace's unique ID for the sales order
   */
  readonly id: string;

  /**
   * The customer facing identifier of the sales order
   */
  readonly orderNumber?: string;

  /**
   * Your own identifiers for this sales order
   */
  readonly identifiers: Identifiers;
}

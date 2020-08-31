import { SalesOrderIdentifierPOJO } from "./sales-order-identifier";

export interface AcknowledgedSalesOrder extends SalesOrderIdentifierPOJO {

  /**
   * Indicate whether the sales order's import was successfully processed.
   */
  succeeded: boolean;

  /**
   * Additional context for why the acknowledgement failed.
   */
  failureReason?: string;
}

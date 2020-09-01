import { DateTimeZone } from "../../internal/input";
import { SalesOrderIdentifierPOJO } from "./sales-order-identifier";

export interface SalesOrderNotification extends SalesOrderIdentifierPOJO {
  /**
   * The customer facing identifier of the sales order
   */
  orderNumber: string;

  /**
   * The date that the order was imported.
   */
  importedDate: DateTimeZone;
}

import type { Note, Quantity } from "../../common";
import type { SalesOrderItemIdentifier } from "../../orders";
import type { ProductIdentifier } from "../../products";

/**
 * An item inside a package
 */
export interface SalesOrderPackageItem {
  /**
   * The sales order item associated with this item
   */
  readonly salesOrderItem?: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the package
   */
  readonly quantity: Quantity;
  
  /**
   * The three character ISO 4217 code of the currency used for all monetary amounts
   */
  readonly currency?: string;

  /**
   * Additional notes associated with this notification or its sales order
   */
  readonly notes?: Note[];
}

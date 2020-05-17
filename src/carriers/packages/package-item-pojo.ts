import { IdentifiersPOJO, MonetaryValuePOJO, QuantityPOJO } from "../../common";
import { SalesOrderIdentifierPOJO, SalesOrderItemIdentifierPOJO } from "../../orders";
import { ProductIdentifierPOJO } from "../../products";

/**
 * An item inside a package
 */
export interface PackageItemPOJO {
  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * Custom identifiers for this item
   */
  identifiers?: IdentifiersPOJO;

  /**
   * The sales order associated with this item
   */
  salesOrder?: SalesOrderIdentifierPOJO;

  /**
   * The sales order item associated with this item
   */
  salesOrderItem?: SalesOrderItemIdentifierPOJO;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifierPOJO;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: QuantityPOJO;

  /**
   * The sale price of each item
   */
  unitPrice: MonetaryValuePOJO;
}

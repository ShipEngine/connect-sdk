import { IdentifierPOJO, MonetaryValuePOJO, QuantityPOJO } from "../../common";
import { SalesOrderIdentifierPOJO } from "../../order";

/**
 * An item inside a package
 */
export interface PackageItemPOJO {
  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * Alternative identifiers associated with this item
   */
  identifiers?: IdentifierPOJO[];

  /**
   * The sales order associated with this item
   */
  salesOrder?: SalesOrderIdentifierPOJO;

  /**
   * The quantity of this item in the package. May be zero.
   */
  quantity: QuantityPOJO;

  /**
   * The sale price of each item
   */
  unitPrice: MonetaryValuePOJO;
}

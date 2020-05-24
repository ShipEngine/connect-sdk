import type { Identifiers, IdentifiersPOJO, MonetaryValue, MonetaryValuePOJO, Quantity, QuantityPOJO } from "../../common";
import type { SalesOrderIdentifier, SalesOrderIdentifierPOJO, SalesOrderItemIdentifier, SalesOrderItemIdentifierPOJO } from "../../orders";
import type { ProductIdentifier, ProductIdentifierPOJO } from "../../products";

/**
 * An item inside a package
 */
export interface PackageItemPOJO {
  /**
   * The Stock Keeping Unit code
   */
  sku?: string;

  /**
   * Your own identifiers for this item
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


/**
 * An item inside a package
 */
export interface PackageItem {
  /**
   * The Stock Keeping Unit code
   */
  readonly sku: string;

  /**
   * Your own identifiers for this item
   */
  readonly identifiers: Identifiers;

  /**
   * The sales order associated with this item
   */
  readonly salesOrder?: SalesOrderIdentifier;

  /**
   * The sales order item associated with this item
   */
  readonly salesOrderItem?: SalesOrderItemIdentifier;

  /**
   * The product associated with this item
   */
  readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the package. May be zero.
   */
  readonly quantity: Quantity;

  /**
   * The sale price of each item
   */
  readonly unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  readonly totalPrice: MonetaryValue;
}

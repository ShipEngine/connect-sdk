import { ProductIdentifierPOJO, QuantityPOJO, SalesOrderItemIdentifierPOJO, SalesOrderPackageItem as ISalesOrderPackageItem } from "../../../public";
import { hideAndFreeze, Joi, Quantity, _internal } from "../../common";
import { SalesOrderItemIdentifier } from "../../orders/sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export interface SalesOrderPackageItemPOJO {
  salesOrderItem: SalesOrderItemIdentifierPOJO;
  product?: ProductIdentifierPOJO;
  quantity: QuantityPOJO;
}


export class SalesOrderPackageItem implements ISalesOrderPackageItem {
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Quantity[_internal].schema.required(),
    }),
  };

  public readonly salesOrderItem?: SalesOrderItemIdentifier;
  public readonly product?: ProductIdentifier;
  public readonly quantity: Quantity;

  public constructor(pojo: SalesOrderPackageItemPOJO) {
    this.salesOrderItem = new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

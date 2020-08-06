import { ProductIdentifierPOJO, QuantityPOJO, SalesOrderIdentifierPOJO, SalesOrderItemIdentifierPOJO, SalesOrderPackageItem as ISalesOrderPackageItem } from "../../../public";
import { hideAndFreeze, Joi, Quantity, _internal } from "../../common";
import { SalesOrderIdentifier } from "../../orders/sales-order-identifier";
import { SalesOrderItemIdentifier } from "../../orders/sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export interface SalesOrderPackageItemPOJO {
  salesOrder: SalesOrderIdentifierPOJO;
  salesOrderItem: SalesOrderItemIdentifierPOJO;
  product?: ProductIdentifierPOJO;
  quantity: QuantityPOJO;
}


export class SalesOrderPackageItem implements ISalesOrderPackageItem {
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      salesOrder: SalesOrderIdentifier[_internal].schema.unknown(true).required(),
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true).required(),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Quantity[_internal].schema.required(),
    }),
  };

  public readonly salesOrder: SalesOrderIdentifier;
  public readonly salesOrderItem: SalesOrderItemIdentifier;
  public readonly product?: ProductIdentifier;
  public readonly quantity: Quantity;

  public constructor(pojo: SalesOrderPackageItemPOJO) {
    this.salesOrder = new SalesOrderIdentifier(pojo.salesOrder);
    this.salesOrderItem = new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

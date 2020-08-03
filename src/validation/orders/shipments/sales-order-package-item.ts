import { SalesOrderPackageItem as ISalesOrderPackageItem, SalesOrderPackageItem as SalesOrderPackageItemPOJO } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { SalesOrderIdentifier } from "../sales-order-identifier";
import { SalesOrderItemIdentifier } from "../sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export class SalesOrderPackageItem implements ISalesOrderPackageItem {
  public static [_internal] = {
    label: "package item",
    schema: Joi.object({
      salesOrder: SalesOrderIdentifier[_internal].schema.unknown(true).required(),
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true).required(),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Joi.number().required(),
    }),
  };

  public salesOrder: SalesOrderIdentifier;
  public salesOrderItem: SalesOrderItemIdentifier;
  public product?: ProductIdentifier;
  public quantity: Number;

  public constructor(pojo: SalesOrderPackageItemPOJO) {
    this.salesOrder = new SalesOrderIdentifier(pojo.salesOrder);
    this.salesOrderItem = new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = pojo.quantity;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

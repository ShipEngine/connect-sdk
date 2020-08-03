import * as currency from "currency.js";
import { PackageItem as IPackageItem, PackageItem as PackageItemPOJO } from "../../../definitions";
import { hideAndFreeze, Identifiers, Joi, MonetaryValue, _internal } from "../../common";
import { SalesOrderIdentifier } from "../../orders/sales-order-identifier";
import { SalesOrderItemIdentifier } from "../../orders/sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export class PackageItem implements IPackageItem {
  public static [_internal] = {
    label: "package item",
    schema: Joi.object({
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
      salesOrder: SalesOrderIdentifier[_internal].schema.unknown(true),
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Joi.number().required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
    }),
  };

  public sku: string;
  public identifiers: Identifiers;
  public salesOrder?: SalesOrderIdentifier;
  public salesOrderItem?: SalesOrderItemIdentifier;
  public product?: ProductIdentifier;
  public quantity: Number;
  public unitPrice: MonetaryValue;

  public get totalPrice(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity as number).toString(),
      currency: this.unitPrice.currency,
    });
  }

  public constructor(pojo: PackageItemPOJO) {
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);
    this.salesOrder = pojo.salesOrder && new SalesOrderIdentifier(pojo.salesOrder);
    this.salesOrderItem = pojo.salesOrderItem && new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = pojo.quantity;
    this.unitPrice = new MonetaryValue(pojo.unitPrice);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

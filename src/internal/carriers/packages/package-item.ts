import * as currency from "currency.js";
import { IdentifiersPOJO, MonetaryValuePOJO, PackageItem as IPackageItem, ProductIdentifierPOJO, QuantityPOJO, SalesOrderIdentifierPOJO, SalesOrderItemIdentifierPOJO } from "../../../public";
import { hideAndFreeze, Identifiers, Joi, MonetaryValue, Quantity, _internal } from "../../common";
import { SalesOrderIdentifier } from "../../orders/sales-order-identifier";
import { SalesOrderItemIdentifier } from "../../orders/sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export interface PackageItemPOJO {
  sku?: string;
  identifiers?: IdentifiersPOJO;
  salesOrder?: SalesOrderIdentifierPOJO;
  salesOrderItem?: SalesOrderItemIdentifierPOJO;
  product?: ProductIdentifierPOJO;
  quantity: QuantityPOJO;
  unitPrice: MonetaryValuePOJO;
}


export class PackageItem implements IPackageItem {
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
      salesOrder: SalesOrderIdentifier[_internal].schema.unknown(true),
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Quantity[_internal].schema.required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
    }),
  };

  public readonly sku: string;
  public readonly identifiers: Identifiers;
  public readonly salesOrder?: SalesOrderIdentifier;
  public readonly salesOrderItem?: SalesOrderItemIdentifier;
  public readonly product?: ProductIdentifier;
  public readonly quantity: Quantity;
  public readonly unitPrice: MonetaryValue;

  public get totalPrice(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity.value).value,
      currency: this.unitPrice.currency,
    });
  }

  public constructor(pojo: PackageItemPOJO) {
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);
    this.salesOrder = pojo.salesOrder && new SalesOrderIdentifier(pojo.salesOrder);
    this.salesOrderItem = pojo.salesOrderItem && new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);
    this.unitPrice = new MonetaryValue(pojo.unitPrice);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

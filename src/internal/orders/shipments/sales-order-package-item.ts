import { ProductIdentifierPOJO, QuantityPOJO, SalesOrderItemIdentifierPOJO, SalesOrderPackageItem as ISalesOrderPackageItem } from "../../../public";
import { hideAndFreeze, Joi, Note, Quantity, _internal } from "../../common";
import { SalesOrderItemIdentifier } from "../../orders/sales-order-item-identifier";
import { ProductIdentifier } from "../../products";

export interface SalesOrderPackageItemPOJO {
  salesOrderItem: SalesOrderItemIdentifierPOJO;
  product?: ProductIdentifierPOJO;
  quantity: QuantityPOJO;
  currency?: string;
  notes?: Note[];
}


export class SalesOrderPackageItem implements ISalesOrderPackageItem {
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      salesOrderItem: SalesOrderItemIdentifier[_internal].schema.unknown(true),
      product: ProductIdentifier[_internal].schema.unknown(true),
      quantity: Quantity[_internal].schema.required(),
      currency: Joi.string().optional().allow(""),
      notes: Joi.array().optional().items(Note[_internal].schema),
    }),
  };

  public readonly salesOrderItem?: SalesOrderItemIdentifier;
  public readonly product?: ProductIdentifier;
  public readonly quantity: Quantity;
  public readonly currency?: string;
  public readonly notes?: Note[];

  public constructor(pojo: SalesOrderPackageItemPOJO) {
    this.salesOrderItem = new SalesOrderItemIdentifier(pojo.salesOrderItem);
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);
    this.currency = pojo.currency;
    this.notes = pojo.notes;
    // Make this object immutable
    hideAndFreeze(this);
  }
}
